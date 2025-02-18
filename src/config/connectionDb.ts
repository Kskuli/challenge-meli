import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { DB_NAME, DB_USER, DB_PASS,DB_HOST,DB_PORT } = process.env;
if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST || !DB_PORT) {
  throw new Error('Database configuration is incomplete');
}

const sequelize = new Sequelize(
  DB_NAME, DB_USER, DB_PASS, 
  {
    host: DB_HOST,
    dialect: "postgres",
    port: Number(DB_PORT),
    pool: {
      max: 35,      
      min: 0,     
      acquire: 30000,
      idle: 5000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

export default sequelize;
