import { Request, Response } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';

export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: `${Messages.ROUTE_NOT_FOUND}: ${req.method} ${req.originalUrl}`,
  });
};
