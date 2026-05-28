import { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';

import { BaseController } from '../../core/base/BaseController';

import { getAuth } from '../../config/auth';

import { requireAuth } from '../../core/middleware/auth.middleware';

import { asyncHandler } from '../../core/utils/asyncHandler';

import { sendSuccess } from '../../core/utils/response';

import { Messages } from '../../core/constants/messages';

/**
 * AuthController mounts the better-auth request handler at /api/auth/*
 * and adds a /api/auth/me endpoint to get the current session user.
 *
 * better-auth exposes built-in routes:
 *   POST /api/auth/sign-up/email
 *   POST /api/auth/sign-in/email
 *   POST /api/auth/sign-out
 *   GET  /api/auth/session
 */
export class AuthController extends BaseController {
  private readonly betterAuthHandler =
    toNodeHandler(getAuth());

  constructor() {
    super();
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    // Custom /me endpoint — must be registered BEFORE the wildcard catch-all
    this.router.get(
      '/me',
      requireAuth,
      asyncHandler(this.me.bind(this)),
    );

    // Delegate all other /api/auth/* requests to better-auth
    this.router.use(this.betterAuthHandler);
  }

  private async me(
    req: Request,
    res: Response,
  ): Promise<void> {
    sendSuccess(res, req.user, Messages.SUCCESS);
  }
}