import { Router } from 'express';
import dealerController from '../controllers/dealer.controller';

const router = Router();

router.get('/', dealerController.getAllDealers);
router.post('/register', dealerController.registerDealer);
router.patch('/:id/status', dealerController.updateStatus);

export default router;
