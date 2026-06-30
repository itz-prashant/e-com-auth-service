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

describe("POST /auth/users", () => {
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
        it("should persist the user in database", async () => {
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
                tenantId: 1,
            };
            const accessToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            const res = await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0]?.email).toBe(userData.email);
        });

        it("should create a manager user", async () => {
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
                tenantId: 1,
            };
            const accessToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0]?.role).toBe(Roles.MANAGER);
        });

        it.todo("should return 403 if non admin user tries to create a user");
    });
});
