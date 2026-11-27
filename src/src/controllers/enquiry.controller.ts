import { Request, Response, NextFunction } from 'express';
import enquiryService from '../services/enquiry.service';
import { successResponse } from '../utils/response.util';

export class EnquiryController {
  getAllEnquiries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const enquiries = await enquiryService.getAllEnquiries();
      return successResponse(res, enquiries);
    } catch (error) {
      next(error);
    }
  };

  createEnquiry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const enquiry = await enquiryService.createEnquiry(req.body);
      return res.status(201).json({
        success: true,
        message: 'Inquiry submitted successfully! An ANIMEX representative will call you shortly.',
        data: enquiry,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new EnquiryController();
