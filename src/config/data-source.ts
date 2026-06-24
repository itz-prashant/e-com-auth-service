import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { CONFIG } from ".";
import { RefreshToken } from "../entities/RefreshToken";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: CONFIG.DB_HOST!,
    port: Number(CONFIG.DB_PORT),
    username: CONFIG.DB_USERNAME!,
    password: CONFIG.DB_PASSWORD!,
    database: CONFIG.DB_NAME!,
    synchronize: true, // don't use this in production , Always keep false
    logging: false,
    entities: [User, RefreshToken],
    migrations: [],
    subscribers: [],
});
