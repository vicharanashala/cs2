import { Document } from 'mongoose';
import { Role } from '../../core/constants/roles';

export interface IUser extends Document {
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
