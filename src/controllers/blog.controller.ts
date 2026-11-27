import { Request, Response, NextFunction } from 'express';
import infoService from '../services/info.service';
import { successResponse } from '../utils/response.util';

export class BlogController {
  getBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogs = await infoService.getBlogs();
      return successResponse(res, blogs);
    } catch (error) {
      next(error);
    }
  };
}

export default new BlogController();
