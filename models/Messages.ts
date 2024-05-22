import { db } from "../config";
import { BOOLEAN, STRING } from "sequelize";


export const Messages = db.define("messages", {
    mediaUrl: {
        type: STRING
    },
    body: {
        type: STRING
    }
})

