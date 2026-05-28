import { z } from 'zod';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  history: ChatMessage[];
}

export interface RagResult {
  answer: string;
  sources: Array<{
    _id: string;
    question: string;
    answer: string;
    score: number;
  }>;
}

export interface ChatbotResult extends RagResult {
  sessionId: string;
}

// DTOs
export const AskQuestionDto = z.object({
  question: z.string().min(1, 'Question is required').trim(),
});

export const ChatbotDto = z.object({
  question: z.string().min(1, 'Question is required').trim(),
  sessionId: z.string().optional(),
});

export const ClearSessionDto = z.object({
  sessionId: z.string().min(1, 'sessionId is required'),
});

export type AskQuestionDtoType = z.infer<typeof AskQuestionDto>;
export type ChatbotDtoType = z.infer<typeof ChatbotDto>;
export type ClearSessionDtoType = z.infer<typeof ClearSessionDto>;
