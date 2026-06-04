"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = refreshAccessToken;
exports.signUpUser = signUpUser;
exports.loginUser = loginUser;
const crypto_1 = require("crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '15m';
const JWT_SECRET_KEY = JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret-key';
const REFRESH_EXPIRE = process.env.REFRESH_EXPIRE || '7d';
const jwtSignOptions = {
    expiresIn: JWT_EXPIRE,
};
function hashPassword(password) {
    const salt = (0, crypto_1.randomBytes)(16).toString('hex');
    const derived = (0, crypto_1.pbkdf2Sync)(password, salt, 310000, 32, 'sha256').toString('hex');
    return `${salt}$${derived}`;
}
function verifyPassword(password, passwordHash) {
    const [salt, hashed] = passwordHash.split('$');
    if (!salt || !hashed)
        return false;
    const derived = (0, crypto_1.pbkdf2Sync)(password, salt, 310000, 32, 'sha256').toString('hex');
    const hashedBuffer = Buffer.from(hashed, 'hex');
    const derivedBuffer = Buffer.from(derived, 'hex');
    if (hashedBuffer.length !== derivedBuffer.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(hashedBuffer, derivedBuffer);
}
function generateTokens(user) {
    const accessPayload = {
        sub: user.id.toString(),
        email: user.email,
    };
    const refreshPayload = {
        sub: user.id.toString(),
    };
    const accessToken = jsonwebtoken_1.default.sign(accessPayload, JWT_SECRET_KEY, jwtSignOptions);
    const refreshToken = jsonwebtoken_1.default.sign(refreshPayload, REFRESH_SECRET, {
        expiresIn: REFRESH_EXPIRE,
    });
    return { accessToken, refreshToken };
}
async function refreshAccessToken(token) {
    try {
        const payload = jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
        const userId = Number(payload.sub);
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.isActive)
            return null;
        return generateTokens(user);
    }
    catch (e) {
        return null;
    }
}
async function signUpUser(payload) {
    const passwordHash = hashPassword(payload.password);
    const user = await db_1.prisma.user.create({
        data: {
            email: payload.email,
            passwordHash,
            fullName: payload.fullName ?? null,
        },
    });
    const tokens = generateTokens(user);
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: 'Bearer',
        expiresIn: JWT_EXPIRE,
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        },
    };
}
async function loginUser(payload) {
    const user = await db_1.prisma.user.findUnique({ where: { email: payload.email } });
    if (!user)
        return null;
    if (!verifyPassword(payload.password, user.passwordHash))
        return null;
    if (!user.isActive)
        return null;
    const { accessToken, refreshToken } = generateTokens(user);
    return {
        accessToken,
        refreshToken, // Trả về thêm refresh token
        tokenType: 'Bearer',
        expiresIn: JWT_EXPIRE,
        user: { id: user.id, email: user.email, fullName: user.fullName },
    };
}
