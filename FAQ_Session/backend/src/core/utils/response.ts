import { Response } from 'express';
import { HttpStatus, HttpStatusCode } from '../constants/httpStatus';
import { ApiSuccessResponse, PaginatedResult } from '../types/api.types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode: HttpStatusCode = HttpStatus.OK,
): Response<ApiSuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message = 'Created successfully',
): Response<ApiSuccessResponse<T>> => {
  return sendSuccess(res, data, message, HttpStatus.CREATED);
};

export const sendPaginated = <T>(
  res: Response,
  result: PaginatedResult<T>,
  message = 'Success',
): Response => {
  return res.status(HttpStatus.OK).json({
    success: true,
    message,
    ...result,
  });
};
