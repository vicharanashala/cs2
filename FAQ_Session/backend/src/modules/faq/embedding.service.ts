import { embeddings } from '../../config/genai';
import { BaseService } from '../../core/base/BaseService';

export class EmbeddingService extends BaseService {
  async createEmbedding(text: string): Promise<number[]> {
    const embedding = await embeddings.embedQuery(text);
    return embedding;
  }

  buildEmbeddingText(question: string, answer: string): string {
    return `Question: ${question}\n\nAnswer: ${answer}`;
  }
}

// Singleton export for convenience
export const embeddingService = new EmbeddingService();
