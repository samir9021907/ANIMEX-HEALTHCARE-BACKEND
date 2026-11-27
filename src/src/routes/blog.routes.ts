import { Router } from 'express';
import blogController from '../controllers/blog.controller';

const router = Router();

router.get('/', blogController.getBlogs);

export default router;
