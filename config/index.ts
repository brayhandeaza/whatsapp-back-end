import "dotenv/config"
import { Sequelize } from "sequelize";
import pg from "pg"

export const db = new Sequelize({
    dialect: 'postgres',
    username: process.env.LOCAL_USER,
    password: process.env.LOCAL_PASSWORD,
    database: process.env.LOCAL_DATABASE,
    host: process.env.LOCAL_HOST,
    port: Number(process.env.LOCAL_PORT) || 5432,
    dialectModule: pg, // I've added this.
    timezone: process.env.TZ,
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
    logging: false
})