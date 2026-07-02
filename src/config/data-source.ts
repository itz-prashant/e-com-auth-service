import "reflect-metadata";
import { DataSource } from "typeorm";
import { CONFIG } from ".";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: CONFIG.DB_HOST!,
    port: Number(CONFIG.DB_PORT),
    username: CONFIG.DB_USERNAME!,
    password: CONFIG.DB_PASSWORD!,
    database: CONFIG.DB_NAME!,
    synchronize: false, // don't use this in production , Always keep false
    logging: false,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: ["src/entities/*.{ts,js}"],
    migrations: ["src/migration/*.ts"],
    subscribers: [],
});
