"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageUpdateValidationSchema = exports.MessageValidationSchema = exports.UnReadMessagesConversationValidationQueryParams = exports.MessagesConversationValidationQueryParams = void 0;
const joi_1 = __importDefault(require("joi"));
exports.MessagesConversationValidationQueryParams = joi_1.default.object({
    page: joi_1.default.number().integer().required(),
    pageSize: joi_1.default.number().integer().required(),
});
exports.UnReadMessagesConversationValidationQueryParams = joi_1.default.object({
    lastSeenDate: joi_1.default.date().required(),
});
exports.MessageValidationSchema = joi_1.default.object({
    body: joi_1.default.string().optional(),
    mediaUrl: joi_1.default.string().optional(),
    conversationId: joi_1.default.number().integer().required(),
    userId: joi_1.default.number().integer().required()
});
exports.MessageUpdateValidationSchema = joi_1.default.object({
    body: joi_1.default.string().optional(),
    mediaUrl: joi_1.default.string().optional(),
});
