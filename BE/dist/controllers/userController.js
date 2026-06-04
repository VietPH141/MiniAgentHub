"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.getUser = getUser;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const userService = __importStar(require("../services/userService"));
function formatErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
async function listUsers(req, res, next) {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}
async function getUser(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const user = await userService.getUserById(Number(id));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}
async function createUser(req, res, next) {
    const { email, password, fullName, roleId, isActive } = req.body;
    if (!email || !password || !roleId) {
        return res.status(400).json({ error: 'email, password and roleId are required' });
    }
    const payload = {
        email,
        password,
        fullName: fullName ?? null,
        roleId,
        isActive,
    };
    try {
        const newUser = await userService.createUser(payload);
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error(error);
        if (error?.code === 'P2002') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: formatErrorMessage(error) || 'Failed to create user' });
    }
}
async function updateUser(req, res, next) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { email, password, fullName, roleId, isActive } = req.body;
    const payload = {
        email,
        password,
        fullName: fullName ?? undefined,
        roleId,
        isActive,
    };
    try {
        const updated = await userService.updateUser(Number(id), payload);
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        if (error?.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        if (error?.code === 'P2002') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: formatErrorMessage(error) || 'Failed to update user' });
    }
}
async function deleteUser(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await userService.deleteUser(Number(id));
        res.status(204).end();
    }
    catch (error) {
        console.error(error);
        if (error?.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: formatErrorMessage(error) || 'Failed to delete user' });
    }
}
