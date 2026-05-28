import { z } from 'zod';

// Admin directly creates an FAQ with both question and answer
export const CreateFaqDto = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').trim(),
  answer: z.string().min(1, 'Answer is required').trim(),
});

export const UpdateFaqDto = z.object({
  question: z.string().min(5).trim().optional(),
  answer: z.string().min(1).trim().optional(),
}).refine((data) => data.question || data.answer, {
  message: 'At least one of question or answer must be provided',
});

export type CreateFaqDtoType = z.infer<typeof CreateFaqDto>;
export type UpdateFaqDtoType = z.infer<typeof UpdateFaqDto>;
