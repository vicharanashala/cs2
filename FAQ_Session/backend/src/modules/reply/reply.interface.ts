import { Document, Types } from 'mongoose';

export interface IReply extends Document {
  _id: Types.ObjectId;
  queryId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
