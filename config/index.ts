import "dotenv/config"
import { Sequelize } from "sequelize";



export const db = new Sequelize(process.env.POSTGRES_URL!)

