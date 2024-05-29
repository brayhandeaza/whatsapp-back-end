import "dotenv/config"
import { Sequelize } from "sequelize";
import pg from "pg"


// export const db = new Sequelize(process.env.POSTGRES_URL!)




export const db = {
    dialect: 'postgres',
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialectModule: pg, // I've added this.
    timezone: process.env.TZ,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
    logging: false,
  };