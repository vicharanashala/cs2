import mongoose, { Schema } from 'mongoose';
import { IFaq } from './faq.interface';

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    embedding: { type: [Number], default: [] },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sourceQueryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Query',
      default: null,
    },
    approvedReplyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply',
      default: null,
    },
  },
  { timestamps: true },
);

export const FaqModel = mongoose.model<IFaq>('Faq', faqSchema);
