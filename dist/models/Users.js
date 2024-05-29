"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const config_1 = require("../config");
const sequelize_1 = require("sequelize");
exports.Users = config_1.db.define("users", {
    fullName: {
        type: sequelize_1.STRING
    },
    imageUrl: {
        type: sequelize_1.STRING,
        defaultValue: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    email: {
        type: sequelize_1.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.STRING,
        allowNull: false
    }
});
