import mongoose, { Schema } from 'mongoose';
import { IReply } from './reply.interface';

const replySchema = new Schema<IReply>(
  {
    queryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Query',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const ReplyModel = mongoose.model<IReply>('Reply', replySchema);
