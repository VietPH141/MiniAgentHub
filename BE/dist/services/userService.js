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
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const crypto_1 = require("crypto");
const userRepository = __importStar(require("../repositories/userRepository"));
function hashPassword(password) {
    const salt = (0, crypto_1.randomBytes)(16).toString('hex');
    const derived = (0, crypto_1.pbkdf2Sync)(password, salt, 310000, 32, 'sha256').toString('hex');
    return `${salt}$${derived}`;
}
async function getAllUsers() {
    return userRepository.findAllUsers();
}
async function getUserById(id) {
    return userRepository.findUserById(id);
}
async function createUser(data) {
    const passwordHash = hashPassword(data.password);
    return userRepository.createUserEntity({ ...data, passwordHash });
}
async function updateUser(id, payload) {
    if (payload.password)
        payload.password = hashPassword(payload.password);
    return userRepository.updateUserEntity(id, payload);
}
async function deleteUser(id) {
    return userRepository.deleteUserEntity(id);
}
