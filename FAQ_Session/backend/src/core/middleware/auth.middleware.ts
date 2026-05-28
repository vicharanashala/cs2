import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { getAuth } from '../../config/auth';
import { UnauthorizedError, ForbiddenError } from '../errors';
import { Role } from '../constants/roles';
import { asyncHandler } from '../utils/asyncHandler';
import type { AuthUser } from '../types/express';

/**
 * Validates the better-auth session and attaches user to req.user.
 */
export const requireAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const session = await getAuth().api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // Map better-auth user to our AuthUser shape
    req.user = session.user as unknown as AuthUser;
    next();
  },
);

/**
 * Requires that the authenticated user has one of the given roles.
 * Must be used after requireAuth.
 */
export const requireRole = (...roles: Role[]) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!roles.includes(req.user.role as Role)) {
      throw new ForbiddenError(
        `Forbidden – requires one of roles: ${roles.join(', ')}`,
      );
    }

    next();
  });
