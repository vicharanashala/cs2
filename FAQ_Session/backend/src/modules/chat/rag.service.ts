import { ChatOllama } from '@langchain/ollama';
import { HumanMessage } from '@langchain/core/messages';
import { BaseService } from '../../core/base/BaseService';
import { FaqRepository } from '../faq/faq.repository';
import { EmbeddingService } from '../faq/embedding.service';
import { RagResult } from './chat.interface';

const SIMILARITY_THRESHOLD = 0.82;

const RAG_PROMPT = (context: string, question: string): string => `\
You are a helpful FAQ assistant.
Answer the user's question using the FAQ context provided below.
Summarize and combine information from multiple FAQs if needed.
Only say "I could not find relevant information" if the context has absolutely nothing related.

FAQ Context:
${context}

User Question: ${question}

Answer:`;

export class RagService extends BaseService {
  private readonly llm: ChatOllama;

  constructor(
    private readonly faqRepo: FaqRepository,
    private readonly embeddingService: EmbeddingService,
  ) {
    super();
    this.llm = new ChatOllama({ model: 'llama3.2', temperature: 0.3 });
  }

  async ask(question: string): Promise<RagResult> {
    const queryEmbedding = await this.embeddingService.createEmbedding(question);
    const results = await this.faqRepo.vectorSearch(queryEmbedding);

    const relevant = results.filter((doc) => doc.score >= SIMILARITY_THRESHOLD);

    if (relevant.length === 0) {
      return {
        answer: 'I could not find relevant information for your question.',
        sources: [],
      };
    }

    const context = relevant
      .map((faq) => `Question: ${faq.question}\nAnswer: ${faq.answer}`)
      .join('\n\n');

    this.logger.debug('RAG context sent to LLM', { question, contextLength: context.length });

    const response = await this.llm.invoke([
      new HumanMessage(RAG_PROMPT(context, question)),
    ]);

    const answer =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    return {
      answer,
      sources: relevant.map((r) => ({
        _id: r._id.toString(),
        question: r.question,
        answer: r.answer,
        score: r.score,
      })),
    };
  }
}
