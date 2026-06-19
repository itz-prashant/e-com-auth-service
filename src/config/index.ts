import path from "node:path";
import { config } from "dotenv";

config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const { PORT, NODE_ENV, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_NAME } =
    process.env;

export const CONFIG = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_PORT,
    DB_NAME,
};
