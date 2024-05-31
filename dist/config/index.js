"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
require("dotenv/config");
const sequelize_1 = require("sequelize");
const pg_1 = __importDefault(require("pg"));
// {
//     dialect: 'postgres',
//     username: process.env.LOCAL_USER,
//     password: process.env.LOCAL_PASSWORD,
//     database: process.env.LOCAL_DATABASE,
//     host: process.env.LOCAL_HOST,
//     port: Number(process.env.LOCAL_PORT) || 5432,
//     dialectModule: pg, // I've added this.
//     timezone: process.env.TZ,
//     define: {
//         charset: 'utf8mb4',
//         collate: 'utf8mb4_general_ci',
//     },
//     logging: false
// }
exports.db = new sequelize_1.Sequelize({
    dialect: 'postgres',
    username: process.env.LOCAL_USER,
    password: process.env.LOCAL_PASSWORD,
    database: process.env.LOCAL_DATABASE,
    host: process.env.LOCAL_HOST,
    port: Number(process.env.LOCAL_PORT) || 5432,
    dialectModule: pg_1.default,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});
