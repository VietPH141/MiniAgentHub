import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { PrismaClient } = (pkg as any);

// 1. Tạo kết nối pool tới PostgreSQL
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Tạo adapter tương ứng cho Prisma 7
const adapter = new PrismaPg(pool);

// 3. Khởi tạo Prisma Client với adapter này
export const prisma: any = new PrismaClient({ adapter });