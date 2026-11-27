import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.util';
import { errorResponse } from '../utils/response.util';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Unhandled Error caught by Middleware:', err);

  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode);
  }

  return errorResponse(res, err.message || 'Internal Server Error', 500, err);
};
