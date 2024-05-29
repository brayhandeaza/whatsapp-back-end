"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidationWithLastSeenQueryParams = exports.UserSearchValidationQueryParams = exports.UserValidationQueryParams = exports.UserValidationSchemaUpdate = exports.UserValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.UserValidationSchema = joi_1.default.object({
    fullName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
exports.UserValidationSchemaUpdate = joi_1.default.object({
    fullName: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    password: joi_1.default.string().optional()
});
exports.UserValidationQueryParams = joi_1.default.object({
    page: joi_1.default.number().integer().required(),
    pageSize: joi_1.default.number().integer().required(),
    userId: joi_1.default.number().integer().required(),
    search: joi_1.default.string().optional()
});
exports.UserSearchValidationQueryParams = joi_1.default.object({
    page: joi_1.default.number().integer().required(),
    pageSize: joi_1.default.number().integer().required(),
    userId: joi_1.default.number().integer().required(),
    search: joi_1.default.string().required()
});
exports.UserValidationWithLastSeenQueryParams = joi_1.default.object({
    lastSeen: joi_1.default.date().required(),
});
