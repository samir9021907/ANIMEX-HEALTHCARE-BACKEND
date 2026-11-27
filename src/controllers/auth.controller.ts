import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { successResponse } from '../utils/response.util';

export class AuthController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      return res.json({
        success: true,
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
