import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { env } from './env';

export const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: env.GOOGLE_API_KEY,
  model: 'models/gemini-embedding-001',
});
