import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../errors';

type ValidateTarget = 'body' | 'query' | 'params';

/**
 * Validates req[target] against a Zod schema.
 * Throws a ValidationError (422) with field-level details on failure.
 */
export const validate =
  (schema: ZodSchema, target: ValidateTarget = 'body'): RequestHandler =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[target]);
      // Replace with the coerced/parsed value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any)[target] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(new ValidationError('Validation failed', details));
      } else {
        next(err);
      }
    }
  };
