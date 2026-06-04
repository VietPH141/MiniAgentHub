"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mini AgentHub API',
            version: '1.0.0',
            description: 'Tài liệu API cho hệ thống quản trị hội thoại AI',
        },
        servers: [
            {
                url: 'http://localhost:3001', // URL của Backend
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // Đường dẫn tới các file chứa chú thích API (JSDoc)
    apis: ['./src/routes/*.ts', './src/index.ts'],
};
exports.specs = (0, swagger_jsdoc_1.default)(options);
