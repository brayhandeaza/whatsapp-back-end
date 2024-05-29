"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRouter = exports.conversationRouter = exports.usersRouter = void 0;
const UsersRouter_1 = __importDefault(require("./UsersRouter"));
exports.usersRouter = UsersRouter_1.default;
const ConversationRouter_1 = __importDefault(require("./ConversationRouter"));
exports.conversationRouter = ConversationRouter_1.default;
const MessagesRouter_1 = __importDefault(require("./MessagesRouter"));
exports.messagesRouter = MessagesRouter_1.default;
