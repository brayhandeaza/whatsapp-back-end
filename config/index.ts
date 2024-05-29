import "dotenv/config"
import { Sequelize } from "sequelize";
import pg from "pg"






export const db = new Sequelize({
    dialect: 'postgres',
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    dialectModule: pg, // I've added this.
    timezone: process.env.TZ,
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
    logging: false
})