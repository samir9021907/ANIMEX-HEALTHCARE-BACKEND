import { Request, Response, NextFunction } from 'express';
import infoService from '../services/info.service';
import { successResponse } from '../utils/response.util';

export class InfoController {
  getCertificates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await infoService.getCertificates();
      return successResponse(res, data);
    } catch (error) {
      next(error);
    }
  };

  getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = infoService.getTestimonials();
      return successResponse(res, data);
    } catch (error) {
      next(error);
    }
  };

  getFaqs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = infoService.getFaqs();
      return successResponse(res, data);
    } catch (error) {
      next(error);
    }
  };

  getCompanyDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = infoService.getCompanyDetails();
      return successResponse(res, data);
    } catch (error) {
      next(error);
    }
  };

  getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await infoService.getAdminStats();
      return successResponse(res, stats);
    } catch (error) {
      next(error);
    }
  };
}

export default new InfoController();
