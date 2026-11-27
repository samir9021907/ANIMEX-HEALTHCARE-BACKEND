import { Request, Response, NextFunction } from 'express';
import productService from '../services/product.service';
import { successResponse } from '../utils/response.util';

export class ProductController {
  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        search: req.query.search as string,
        animal: req.query.animal as string,
        category: req.query.category as string,
        disease: req.query.disease as string,
        isFeatured: req.query.isFeatured as string,
        isBestSeller: req.query.isBestSeller as string,
      };

      const products = await productService.getAllProducts(filters);
      return successResponse(res, products);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.getProductById(req.params.id);
      return res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.createProduct(req.body);
      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await productService.updateProduct(req.params.id, req.body);
      return res.json({
        success: true,
        message: 'Product updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await productService.deleteProduct(req.params.id);
      return res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ProductController();
