import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import dealerRoutes from './dealer.routes';
import enquiryRoutes from './enquiry.routes';
import categoryRoutes from './category.routes';
import diseaseRoutes from './disease.routes';
import blogRoutes from './blog.routes';
import infoRoutes from './info.routes';

const router = Router();

// Modular Routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/dealers', dealerRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/categories', categoryRoutes);
router.use('/diseases', diseaseRoutes);
router.use('/blogs', blogRoutes);
router.use('/', infoRoutes);

export default router;
