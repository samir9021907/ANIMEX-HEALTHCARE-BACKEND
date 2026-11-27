import { pool } from '../config/db';
import { IEnquiry } from '../interface/enquiry.interface';
import { AppError } from '../utils/app-error.util';

class EnquiryService {
  private inMemoryEnquiries: IEnquiry[] = [
    {
      id: 'enq-1',
      name: 'Ramesh Patel',
      phone: '+91 98250 12345',
      email: 'ramesh@gmail.com',
      message: 'Need bulk price for 100 cans of Cal-Gold 5 Litre',
      productId: 'prod-1',
      status: 'PENDING',
      createdAt: '2026-08-01',
    },
    {
      id: 'enq-2',
      name: 'Sunil Verma',
      phone: '+91 98980 11223',
      email: 'sunil@verma.com',
      message: 'Interested in becoming sole distributor in Karnal area.',
      status: 'IN_PROGRESS',
      createdAt: '2026-08-03',
    },
  ];

  async getAllEnquiries(): Promise<IEnquiry[]> {
    try {
      const res = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC');
      if (res.rows && res.rows.length > 0) {
        return res.rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email,
          district: r.district,
          state: r.state,
          subject: r.subject,
          message: r.message,
          productId: r.product_id,
          status: r.status,
          createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '',
        }));
      }
    } catch (err: any) {
      console.warn('⚡ Using memory store for enquiries query:', err.message);
    }

    return this.inMemoryEnquiries;
  }

  async createEnquiry(data: any): Promise<IEnquiry> {
    if (!data.name || !data.phone || !data.message) {
      throw new AppError('Name, phone, and message are required fields.', 400);
    }

    const newEnquiry: IEnquiry = {
      id: `enq-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      district: data.district || '',
      state: data.state || '',
      subject: data.subject || '',
      message: data.message,
      productId: data.productId || null,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      await pool.query(`
        INSERT INTO enquiries (id, name, phone, email, district, state, subject, message, product_id, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        newEnquiry.id,
        newEnquiry.name,
        newEnquiry.phone,
        newEnquiry.email,
        newEnquiry.district,
        newEnquiry.state,
        newEnquiry.subject,
        newEnquiry.message,
        newEnquiry.productId,
        newEnquiry.status
      ]);
    } catch (err: any) {
      console.warn('Neon DB enquiry insert fallback:', err.message);
    }

    this.inMemoryEnquiries.unshift(newEnquiry);
    return newEnquiry;
  }
}

export default new EnquiryService();
