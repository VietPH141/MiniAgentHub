"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
    try {
        const secret = process.env.JWT_SECRET || 'default-secret';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Lưu thông tin id của user vào request để dùng cho middleware sau
        req.user = { id: Number(decoded.sub) };
        next();
    }
    catch (err) {
        return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};
exports.verifyToken = verifyToken;
