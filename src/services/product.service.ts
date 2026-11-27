import { pool } from '../config/db';
import { IProduct } from '../interface/product.interface';
import { PRODUCTS, CATEGORIES } from '../data/seedData';
import { AppError } from '../utils/app-error.util';

class ProductService {
  private inMemoryProducts: IProduct[] = [...(PRODUCTS as any)];

  async getAllProducts(filters: {
    search?: string;
    animal?: string;
    category?: string;
    disease?: string;
    isFeatured?: string;
    isBestSeller?: string;
  }): Promise<IProduct[]> {
    try {
      const res = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
      if (res.rows && res.rows.length > 0) {
        let list: IProduct[] = res.rows.map((r: any) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          sku: r.sku,
          category: r.category,
          summary: r.summary,
          description: r.description,
          targetAnimals: r.target_animals || [],
          isFeatured: r.is_featured,
          isBestSeller: r.is_bestseller,
          image: r.image,
          variants: r.variants || [],
          benefits: r.benefits || [],
          ingredients: typeof r.ingredients === 'string' ? JSON.parse(r.ingredients) : (r.ingredients || []),
          dosage: r.dosage,
          diseases: r.diseases || [],
          created_at: r.created_at,
        }));

        return this.applyFilters(list, filters);
      }
    } catch (err: any) {
      console.warn('⚡ Using memory store for products query:', err.message);
    }

    return this.applyFilters(this.inMemoryProducts, filters);
  }

  private applyFilters(products: IProduct[], filters: any): IProduct[] {
    let result = [...products];

    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.summary && p.summary.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    if (filters.animal) {
      const animalUpper = String(filters.animal).toUpperCase();
      result = result.filter(p => p.targetAnimals && p.targetAnimals.includes(animalUpper as any));
    }

    if (filters.category) {
      const catSlug = String(filters.category).toLowerCase();
      result = result.filter(p => {
        const cat = CATEGORIES.find(c => c.slug === catSlug || c.name.toLowerCase() === catSlug);
        return cat ? p.category === cat.name : p.category.toLowerCase() === catSlug;
      });
    }

    if (filters.disease) {
      const disSlug = String(filters.disease).toLowerCase();
      result = result.filter(p => p.diseases && p.diseases.includes(disSlug));
    }

    if (filters.isFeatured === 'true') {
      result = result.filter(p => p.isFeatured);
    }

    if (filters.isBestSeller === 'true') {
      result = result.filter(p => p.isBestSeller);
    }

    return result;
  }

  async getProductById(idOrSlug: string): Promise<IProduct> {
    try {
      const res = await pool.query('SELECT * FROM products WHERE id = $1 OR slug = $1 LIMIT 1', [idOrSlug]);
      if (res.rows && res.rows.length > 0) {
        const r = res.rows[0];
        return {
          id: r.id,
          title: r.title,
          slug: r.slug,
          sku: r.sku,
          category: r.category,
          summary: r.summary,
          description: r.description,
          targetAnimals: r.target_animals || [],
          isFeatured: r.is_featured,
          isBestSeller: r.is_bestseller,
          image: r.image,
          variants: r.variants || [],
          benefits: r.benefits || [],
          ingredients: typeof r.ingredients === 'string' ? JSON.parse(r.ingredients) : (r.ingredients || []),
          dosage: r.dosage,
          diseases: r.diseases || [],
          created_at: r.created_at,
        };
      }
    } catch (err: any) {
      console.warn('Product find fallback:', err.message);
    }

    const found = this.inMemoryProducts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (!found) {
      throw new AppError('Product not found', 404);
    }
    return found;
  }

  async createProduct(data: any): Promise<IProduct> {
    const id = `prod-${Date.now()}`;
    const slug = (data.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: IProduct = {
      id,
      slug,
      title: data.title,
      sku: data.sku || `SKU-${Date.now()}`,
      category: data.category || 'General',
      summary: data.summary || '',
      description: data.description || '',
      targetAnimals: data.targetAnimals || ['COW', 'BUFFALO'],
      isFeatured: !!data.isFeatured,
      isBestSeller: !!data.isBestSeller,
      image: data.image || '/images/calcimex-gold.jpg',
      variants: data.variants || ['1 Litre', '5 Litre'],
      benefits: data.benefits || [],
      ingredients: data.ingredients || [],
      dosage: data.dosage || '',
      diseases: data.diseases || [],
      created_at: new Date(),
    };

    try {
      await pool.query(`
        INSERT INTO products (id, title, slug, sku, category, summary, description, target_animals, is_featured, is_bestseller, image, variants, benefits, ingredients, dosage, diseases)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [
        newProduct.id,
        newProduct.title,
        newProduct.slug,
        newProduct.sku,
        newProduct.category,
        newProduct.summary,
        newProduct.description,
        newProduct.targetAnimals,
        newProduct.isFeatured,
        newProduct.isBestSeller,
        newProduct.image,
        newProduct.variants,
        newProduct.benefits,
        JSON.stringify(newProduct.ingredients),
        newProduct.dosage,
        newProduct.diseases
      ]);
    } catch (err: any) {
      console.warn('Neon DB insert fallback:', err.message);
    }

    this.inMemoryProducts.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, data: any): Promise<IProduct> {
    try {
      await pool.query(`
        UPDATE products
        SET title = COALESCE($2, title),
            summary = COALESCE($3, summary),
            description = COALESCE($4, description),
            category = COALESCE($5, category),
            image = COALESCE($6, image)
        WHERE id = $1
      `, [id, data.title, data.summary, data.description, data.category, data.image]);
    } catch (err: any) {
      console.warn('Neon DB update fallback:', err.message);
    }

    const idx = this.inMemoryProducts.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.inMemoryProducts[idx] = { ...this.inMemoryProducts[idx], ...data };
      return this.inMemoryProducts[idx];
    }

    throw new AppError('Product not found', 404);
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await pool.query('DELETE FROM products WHERE id = $1', [id]);
    } catch (err: any) {
      console.warn('Neon DB delete fallback:', err.message);
    }

    this.inMemoryProducts = this.inMemoryProducts.filter(p => p.id !== id);
    return true;
  }
}

export default new ProductService();
