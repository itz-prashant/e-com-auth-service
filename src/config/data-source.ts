import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { CONFIG } from ".";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: CONFIG.DB_HOST!,
    port: Number(CONFIG.DB_PORT),
    username: CONFIG.DB_USERNAME!,
    password: CONFIG.DB_PASSWORD!,
    database: CONFIG.DB_NAME!,
    synchronize: CONFIG.NODE_ENV === "test" || CONFIG.NODE_ENV === "dev", // don't use this in production
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
