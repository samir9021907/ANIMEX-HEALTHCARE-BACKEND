import { Router } from 'express';
import infoController from '../controllers/info.controller';

const router = Router();

router.get('/certificates', infoController.getCertificates);
router.get('/testimonials', infoController.getTestimonials);
router.get('/faqs', infoController.getFaqs);
router.get('/company-details', infoController.getCompanyDetails);
router.get('/admin/stats', infoController.getAdminStats);

export default router;
