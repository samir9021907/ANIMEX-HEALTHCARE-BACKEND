import { Request, Response, NextFunction } from 'express';
import dealerService from '../services/dealer.service';
import { successResponse } from '../utils/response.util';

export class DealerController {
  getAllDealers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        state: req.query.state as string,
        district: req.query.district as string,
      };

      const dealers = await dealerService.getAllDealers(filters);
      return successResponse(res, dealers);
    } catch (error) {
      next(error);
    }
  };

  registerDealer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dealer = await dealerService.registerDealer(req.body);
      return res.status(201).json({
        success: true,
        message: 'Dealer registration submitted successfully! Our marketing team will get in touch.',
        data: dealer,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const updated = await dealerService.updateDealerStatus(req.params.id, status);
      return res.json({
        success: true,
        message: `Dealer status updated to ${status}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new DealerController();
