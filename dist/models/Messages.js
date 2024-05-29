"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const config_1 = require("../config");
const sequelize_1 = require("sequelize");
exports.Messages = config_1.db.define("messages", {
    mediaUrl: {
        type: sequelize_1.STRING
    },
    body: {
        type: sequelize_1.STRING
    }
});
