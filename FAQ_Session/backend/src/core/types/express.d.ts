import { Session } from 'better-auth';
import { Role } from '../constants/roles';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Augment Express Request with better-auth session
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      session?: Session & { userId?: string };
    }
  }
}

export {};
