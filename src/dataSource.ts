import "reflect-metadata";
import { DataSource } from "typeorm";
import { MostWantedItems } from "./entities/MostWantedItems";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./db.sqlite", 
  synchronize: true,
  logging: true,
  entities: [MostWantedItems], 
});
