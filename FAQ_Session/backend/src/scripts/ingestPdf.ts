import 'dotenv/config';
import fs from 'fs';
import mongoose from 'mongoose';
import { ChatOllama } from '@langchain/ollama';
import { HumanMessage } from '@langchain/core/messages';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { connectDB } from '../config/db';
import { FaqModel } from '../modules/faq/faq.model';
import { embeddingService } from '../modules/faq/embedding.service';
import { logger } from '../core/utils/logger';
import path from 'path';

const model = new ChatOllama({ model: 'llama3.2', temperature: 0 });

const SYSTEM_ADMIN_ID = new mongoose.Types.ObjectId(
    process.env.SYSTEM_ADMIN_ID,
);

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface FaqPair {
  question: string;
  answer: string;
}

const extractJSON = (text: string): string | null => {
  let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();

  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');

  if (start === -1 || end === -1) return null;

  cleaned = cleaned
    .slice(start, end + 1)
    .replace(/,\s*]/g, ']')
    .replace(/,\s*}/g, '}')
    .replace(/}\s*{/g, '},{');

  return cleaned;
};

const extractTextFromPDF = async (pdfBuffer: Buffer): Promise<string> => {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const uint8Array = new Uint8Array(pdfBuffer);

  const loadingTask = getDocument({ data: uint8Array });

  const pdf = await loadingTask.promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    const content = await page.getTextContent();

    const pageText = (content.items as Array<{ str: string }>)
      .map((item) => item.str)
      .join(' ');

    fullText += pageText + '\n';
  }

  return fullText;
};

const ingestPDF = async (): Promise<void> => {
  await connectDB();

  const pdfPath = path.join(process.cwd(), 'data', 'Faq.pdf');

  if (!fs.existsSync(pdfPath)) {
    logger.error(`PDF not found at ${pdfPath}`);
    process.exit(1);
  }

  const pdfBuffer = fs.readFileSync(pdfPath);

  const pdfText = await extractTextFromPDF(pdfBuffer);

  logger.info('PDF text extracted successfully');

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitText(pdfText);

  logger.info(`Total chunks: ${chunks.length}`);

  await FaqModel.deleteMany({});

  logger.info('Cleared existing FAQs');

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    try {
      logger.info(`Processing chunk ${i + 1}/${chunks.length}...`);

      const prompt = `Extract FAQ pairs from the following text.

Return ONLY a valid JSON array, no explanation, no markdown, no trailing commas.

Format:
[
  {
    "question": "...",
    "answer": "..."
  }
]

Text:
${chunk}`;

      const response = await model.invoke([
        new HumanMessage(prompt),
      ]);

      const rawText =
        typeof response.content === 'string'
          ? response.content
          : JSON.stringify(response.content);

      const cleanedText = extractJSON(rawText);

      if (!cleanedText) {
        logger.warn(`Chunk ${i + 1}: No JSON array found, skipping`);
        continue;
      }

      let faqPairs: FaqPair[];

      try {
        faqPairs = JSON.parse(cleanedText) as FaqPair[];

        if (!Array.isArray(faqPairs)) {
          logger.warn(`Chunk ${i + 1}: Not an array, skipping`);
          continue;
        }
      } catch (err) {
        logger.error(`Chunk ${i + 1}: Failed to parse JSON`, err);
        continue;
      }

      for (const faq of faqPairs) {
        if (!faq.question || !faq.answer) continue;

        const embeddingText = embeddingService.buildEmbeddingText(
          faq.question,
          faq.answer,
        );

        const embedding =
          await embeddingService.createEmbedding(embeddingText);

        await FaqModel.create({
          question: faq.question,
          answer: faq.answer,
          embedding,
          createdBy: SYSTEM_ADMIN_ID,
          approvedBy: SYSTEM_ADMIN_ID,
        });

        logger.info(`Inserted FAQ: ${faq.question}`);

        await sleep(200);
      }
    } catch (err) {
      logger.error(`Chunk ${i + 1} failed`, err);
    }
  }

  logger.info('PDF ingestion completed');

  process.exit(0);
};

ingestPDF().catch((err) => {
  logger.error('Ingestion failed', err);
  process.exit(1);
});