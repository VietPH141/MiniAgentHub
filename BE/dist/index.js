"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});
app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.specs));
// API routes
app.get('/api/roles', async (req, res) => {
    try {
        const roles = await db_1.prisma.role.findMany();
        res.json(roles);
    }
    catch (error) {
        res.status(500).json({ error: 'Lỗi lấy roles' });
    }
});
// Users CRUD routes
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const chatRouter_1 = __importDefault(require("./routes/chatRouter"));
app.use('/api/user', userRouter_1.default);
app.use('/api/auth', authRouter_1.default);
app.use('/api/chat', chatRouter_1.default);
// Error handling middleware (phải được đặt cuối cùng)
app.use(errorMiddleware_1.errorMiddleware);
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend chạy tại http://localhost:${PORT}`);
});
