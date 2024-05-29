"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsLastSeen = exports.ConversationsParticipants = exports.Conversations = void 0;
const config_1 = require("../config");
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
exports.Conversations = config_1.db.define("conversations", {
    uuid: {
        type: sequelize_1.STRING,
        allowNull: false,
        defaultValue: () => (0, uuid_1.v4)()
    },
    archivedBy: {
        type: sequelize_1.JSONB,
        allowNull: false,
        defaultValue: [],
    }
});
exports.ConversationsParticipants = config_1.db.define("user-conversation", {});
exports.ConversationsLastSeen = config_1.db.define("lastSeen", {
    lastSeen: {
        type: sequelize_1.DATE,
        defaultValue: new Date()
    }
});
