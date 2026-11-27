import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  HOST: process.env.HOST || '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'animex_animal_health_care_jwt_secret_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_9RcDCGQqWVw1@ep-plain-dream-a5ky6j1w-pooler.us-east-2.aws.neon.tech/animex_animal_health?sslmode=require',
  DB_HOST: process.env.DB_HOST || 'ep-plain-dream-a5ky6j1w-pooler.us-east-2.aws.neon.tech',
  DB_USER: process.env.DB_USER || 'neondb_owner',
  DB_PASSWORD: process.env.DB_PASSWORD || 'npg_9RcDCGQqWVw1',
  DB_NAME: process.env.DB_NAME || 'animex_animal_health',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
