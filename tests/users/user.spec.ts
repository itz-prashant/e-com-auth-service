import {
    afterAll,
    afterEach,
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
import createJWKSmock from "mock-jwks";
import { User } from "../../src/entities/User";
import { Roles } from "../../src/contsants";

describe("GET /auth/self", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSmock>;

    beforeAll(async () => {
        jwks = createJWKSmock("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return the 200 status code", async () => {
            const accessToken = jwks.token({
                sub: "1",
                role: Roles.CUSTOMER,
            });

            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();

            expect(response.statusCode).toBe(200);
        });

        it("should return the user data", async () => {
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
            };

            const userRepository = connection.getRepository(User);

            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            //Generate token

            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });

            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();

            expect(response.body.id).toBe(data.id);
        });

        it("should not return password", async () => {
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
            };

            const userRepository = connection.getRepository(User);

            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            //Generate token

            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });

            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();

            expect(response.body).not.toHaveProperty("password");
        });

        it("should return 401 status code if token not exist", async () => {
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
            };

            const userRepository = connection.getRepository(User);

            await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            const response = await request(app).get("/auth/self").send();

            expect(response.statusCode).toBe(401);
        });
    });
});
