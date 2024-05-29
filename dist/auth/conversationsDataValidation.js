"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserConversationLastSeenValidation = exports.UserConversationValidationQueryParams = exports.ConversationValidationQueryParams = exports.ConversationValidationUpdateSchema = exports.ConversationValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ConversationValidationSchema = joi_1.default.object({
    participantId: joi_1.default.number().integer().required(),
    userId: joi_1.default.number().integer().required()
});
exports.ConversationValidationUpdateSchema = joi_1.default.object({
    participants: joi_1.default.array().items(joi_1.default.number().integer()).required(),
    archivedBy: joi_1.default.array().items(joi_1.default.string()).optional()
});
exports.ConversationValidationQueryParams = joi_1.default.object({
    page: joi_1.default.number().integer().required(),
    pageSize: joi_1.default.number().integer().required(),
});
exports.UserConversationValidationQueryParams = joi_1.default.object({
    page: joi_1.default.number().integer().required(),
    pageSize: joi_1.default.number().integer().required(),
});
exports.UserConversationLastSeenValidation = joi_1.default.object({
    userId: joi_1.default.number().integer().required(),
    conversationId: joi_1.default.number().integer().required(),
});
