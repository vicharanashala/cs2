import { z } from 'zod';

export const CreateReplyDto = z.object({
  content: z.string().min(1, 'Reply content is required').trim(),
});

export type CreateReplyDtoType = z.infer<typeof CreateReplyDto>;
