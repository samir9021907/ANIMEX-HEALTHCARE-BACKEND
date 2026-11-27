import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { errorResponse } from '../utils/response.util';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication required. Bearer token missing.', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return errorResponse(res, 'Invalid or expired authentication token.', 401);
  }

  req.user = decoded;
  next();
};
