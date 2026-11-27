import { Router } from 'express';
import enquiryController from '../controllers/enquiry.controller';

const router = Router();

router.get('/', enquiryController.getAllEnquiries);
router.post('/', enquiryController.createEnquiry);

export default router;
