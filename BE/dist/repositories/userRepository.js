"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllUsers = findAllUsers;
exports.findUserById = findUserById;
exports.createUserEntity = createUserEntity;
exports.updateUserEntity = updateUserEntity;
exports.deleteUserEntity = deleteUserEntity;
const db_1 = require("../db");
async function findAllUsers() {
    return db_1.prisma.user.findMany({
        select: { id: true, email: true, fullName: true, isActive: true, isFirstLogin: true, role: true, createdAt: true, updatedAt: true },
    });
}
async function findUserById(id) {
    return db_1.prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, fullName: true, isActive: true, isFirstLogin: true, role: true, groups: true, createdAt: true, updatedAt: true },
    });
}
async function createUserEntity(data) {
    return db_1.prisma.user.create({
        data: {
            email: data.email,
            passwordHash: data.passwordHash,
            fullName: data.fullName,
            isActive: data.isActive,
            role: { connect: { id: data.roleId } },
        },
        include: { role: true },
    });
}
async function updateUserEntity(id, data) {
    const payload = {};
    if (data.email)
        payload.email = data.email;
    if (data.fullName !== undefined)
        payload.fullName = data.fullName;
    if (typeof data.isActive === 'boolean')
        payload.isActive = data.isActive;
    if (data.password)
        payload.passwordHash = data.password;
    if (data.roleId)
        payload.role = { connect: { id: data.roleId } };
    return db_1.prisma.user.update({
        where: { id },
        data: payload,
        include: { role: true },
    });
}
async function deleteUserEntity(id) {
    return db_1.prisma.user.delete({ where: { id } });
}
