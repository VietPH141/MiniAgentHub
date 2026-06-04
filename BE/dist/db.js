"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = __importDefault(require("@prisma/client"));
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PrismaClient } = client_1.default;
// 1. Tạo kết nối pool tới PostgreSQL
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
// 2. Tạo adapter tương ứng cho Prisma 7
const adapter = new adapter_pg_1.PrismaPg(pool);
// 3. Khởi tạo Prisma Client với adapter này
exports.prisma = new PrismaClient({ adapter });
