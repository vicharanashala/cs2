import { Document, Types } from 'mongoose';

export interface IFaq extends Document {
  _id: Types.ObjectId;
  question: string;
  answer: string;
  embedding: number[];
  createdBy: Types.ObjectId;          // admin who created the entry
  approvedBy: Types.ObjectId;         // admin who approved (same as createdBy for direct adds)
  sourceQueryId?: Types.ObjectId | null;   // linked Query (null if admin-direct)
  approvedReplyId?: Types.ObjectId | null; // linked Reply (null if admin-direct)
  createdAt: Date;
  updatedAt: Date;
}

export interface IVectorSearchResult {
  _id: Types.ObjectId;
  question: string;
  answer: string;
  score: number;
}
