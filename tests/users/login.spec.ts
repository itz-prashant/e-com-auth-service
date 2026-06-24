import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
} from "@jest/globals";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";

describe("POST /auth/login", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return 201 status code", async () => {
            const userData = {
                email: "prashant@gnail.com",
                password: "123456789",
            };

            const response = await request(app)
                .post("/auth/login")
                .send(userData);

            expect(response.statusCode).toBe(201);
        });
    });
});
