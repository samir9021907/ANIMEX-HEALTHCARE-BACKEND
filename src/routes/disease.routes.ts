import { Router } from 'express';
import diseaseController from '../controllers/disease.controller';

const router = Router();

router.get('/', diseaseController.getDiseases);

export default router;
