import { Request, Response, NextFunction } from 'express';
import infoService from '../services/info.service';
import { successResponse } from '../utils/response.util';

export class CategoryController {
  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = infoService.getCategories();
      return successResponse(res, categories);
    } catch (error) {
      next(error);
    }
  };
}

export default new CategoryController();
