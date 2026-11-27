export interface IDealer {
  id: string;
  firmName: string;
  contactName: string;
  phone: string;
  email?: string;
  district: string;
  state: string;
  address: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at?: string | Date;
}
