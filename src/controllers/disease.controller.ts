import { Request, Response, NextFunction } from 'express';
import infoService from '../services/info.service';
import { successResponse } from '../utils/response.util';

export class DiseaseController {
  getDiseases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const diseases = infoService.getDiseases();
      return successResponse(res, diseases);
    } catch (error) {
      next(error);
    }
  };
}

export default new DiseaseController();
