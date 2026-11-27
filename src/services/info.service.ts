import { pool } from '../config/db';
import { CATEGORIES, DISEASES, BLOGS, CERTIFICATES, TESTIMONIALS, FAQS, COMPANY_DETAILS } from '../data/seedData';
import productService from './product.service';
import dealerService from './dealer.service';
import enquiryService from './enquiry.service';

class InfoService {
  getCategories() {
    return CATEGORIES;
  }

  getDiseases() {
    return DISEASES;
  }

  async getBlogs() {
    try {
      const res = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
      if (res.rows && res.rows.length > 0) {
        return res.rows.map((r: any) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          excerpt: r.excerpt,
          content: r.content,
          coverImage: r.cover_image,
          category: r.category,
          date: r.date,
        }));
      }
    } catch (err: any) {
      console.warn('⚡ Using memory store for blogs:', err.message);
    }
    return BLOGS;
  }

  async getCertificates() {
    try {
      const res = await pool.query('SELECT * FROM certificates');
      if (res.rows && res.rows.length > 0) {
        return res.rows.map((r: any) => ({
          id: r.id,
          title: r.title,
          issuedBy: r.issued_by,
          imageUrl: r.image_url,
        }));
      }
    } catch (err: any) {
      console.warn('⚡ Using memory store for certificates:', err.message);
    }
    return CERTIFICATES;
  }

  getTestimonials() {
    return TESTIMONIALS;
  }

  getFaqs() {
    return FAQS;
  }

  getCompanyDetails() {
    return COMPANY_DETAILS;
  }

  async getAdminStats() {
    const products = await productService.getAllProducts({});
    const dealers = await dealerService.getAllDealers({});
    const enquiries = await enquiryService.getAllEnquiries();

    return {
      totalProducts: products.length,
      totalDealers: dealers.length,
      pendingDealers: dealers.filter(d => d.status === 'PENDING').length,
      totalEnquiries: enquiries.length,
      pendingEnquiries: enquiries.filter(e => e.status === 'PENDING').length,
      totalFarmersServed: '10,000+',
      monthlyGrowthRate: '+24.5%',
    };
  }
}

export default new InfoService();
