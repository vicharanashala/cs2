import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { HttpStatus } from '../constants/httpStatus';
import { logger } from '../utils/logger';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    // Operational / expected errors — log at warn level
    logger.warn(`[${err.name}] ${err.message}`, {
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
      details: err.details,
    });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details !== undefined && { details: err.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Unexpected / programming errors — log at error level
  logger.error(`[UnhandledError] ${err.message}`, { stack: err.stack });

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
