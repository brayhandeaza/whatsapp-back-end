import { db } from "../config";
import { JSONB, NUMBER, DATE, STRING } from "sequelize"
import { v4 as uuid } from "uuid"

export const Conversations = db.define("conversations", {
    uuid: {
        type: STRING,
        allowNull: false,
        defaultValue: () => uuid()
    },
    archivedBy: {
        type: JSONB,
        allowNull: false,
        defaultValue: [],
    }
})


export const ConversationsParticipants = db.define("user-conversation", {})

export const ConversationsLastSeen = db.define("lastSeen", {
    lastSeen: {
        type: DATE,
        defaultValue: new Date()
    }
})