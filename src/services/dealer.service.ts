import { pool } from '../config/db';
import { IDealer } from '../interface/dealer.interface';
import { DEALERS } from '../data/seedData';
import { AppError } from '../utils/app-error.util';

class DealerService {
  private inMemoryDealers: IDealer[] = [...(DEALERS as any)];

  async getAllDealers(filters: { state?: string; district?: string }): Promise<IDealer[]> {
    try {
      const res = await pool.query('SELECT * FROM dealers ORDER BY created_at DESC');
      if (res.rows && res.rows.length > 0) {
        let list: IDealer[] = res.rows.map((r: any) => ({
          id: r.id,
          firmName: r.firm_name,
          contactName: r.contact_name,
          phone: r.phone,
          email: r.email,
          district: r.district,
          state: r.state,
          address: r.address,
          status: r.status,
          created_at: r.created_at,
        }));

        return this.filterDealers(list, filters);
      }
    } catch (err: any) {
      console.warn('⚡ Using memory store for dealers query:', err.message);
    }

    return this.filterDealers(this.inMemoryDealers, filters);
  }

  private filterDealers(dealers: IDealer[], filters: { state?: string; district?: string }): IDealer[] {
    let result = [...dealers];

    if (filters.state) {
      result = result.filter(d => d.state.toLowerCase() === String(filters.state).toLowerCase());
    }

    if (filters.district) {
      result = result.filter(d => d.district.toLowerCase() === String(filters.district).toLowerCase());
    }

    return result;
  }

  async registerDealer(data: any): Promise<IDealer> {
    if (!data.firmName || !data.contactName || !data.phone) {
      throw new AppError('Firm Name, Contact Name, and Phone are required.', 400);
    }

    const newDealer: IDealer = {
      id: `dlr-${Date.now()}`,
      firmName: data.firmName,
      contactName: data.contactName,
      phone: data.phone,
      email: data.email || '',
      district: data.district || '',
      state: data.state || '',
      address: data.address || '',
      status: 'PENDING',
      created_at: new Date(),
    };

    try {
      await pool.query(`
        INSERT INTO dealers (id, firm_name, contact_name, phone, email, district, state, address, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        newDealer.id,
        newDealer.firmName,
        newDealer.contactName,
        newDealer.phone,
        newDealer.email,
        newDealer.district,
        newDealer.state,
        newDealer.address,
        newDealer.status
      ]);
    } catch (err: any) {
      console.warn('Neon DB dealer insert fallback:', err.message);
    }

    this.inMemoryDealers.push(newDealer);
    return newDealer;
  }

  async updateDealerStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<IDealer> {
    try {
      await pool.query('UPDATE dealers SET status = $1 WHERE id = $2', [status, id]);
    } catch (err: any) {
      console.warn('Neon DB dealer update fallback:', err.message);
    }

    const dealer = this.inMemoryDealers.find(d => d.id === id);
    if (!dealer) {
      throw new AppError('Dealer not found', 404);
    }

    dealer.status = status;
    return dealer;
  }
}

export default new DealerService();
