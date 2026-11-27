export interface IEnquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  district?: string;
  state?: string;
  subject?: string;
  message: string;
  productId?: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  createdAt?: string;
}
