import { generateToken } from '../utils/jwt.util';
import { AppError } from '../utils/app-error.util';

export class AuthService {
  async login(payload: { email?: string; password?: string }) {
    const { email, password } = payload;
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    if (email === 'admin@animexhealth.com' && password === 'admin123') {
      const user = {
        id: 'usr-admin-1',
        name: 'Dr. A. K. Sharma (Super Admin)',
        email: 'admin@animexhealth.com',
        role: 'SUPER_ADMIN' as const,
      };

      const token = generateToken(user);
      return {
        token,
        user,
      };
    }

    throw new AppError('Invalid email or password. Use admin@animexhealth.com / admin123', 401);
  }
}

export default new AuthService();
