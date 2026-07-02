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
import { User } from "../../src/entities/User";
import bcrypt from "bcryptjs";
import { Roles } from "../../src/contsants";
import { isJwt } from "../utils/utils";

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
        it("should return 200 status code", async () => {
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
            };

            await request(app).post("/auth/register").send(userData);

            const response = await request(app).post("/auth/login").send({
                email: userData.email,
                password: userData.password,
            });

            expect(response.statusCode).toBe(200);
        });

        it("should return valid json format", async () => {
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
            };

            await request(app).post("/auth/register").send(userData);

            const response = await request(app).post("/auth/login").send({
                email: userData.email,
                password: userData.password,
            });

            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });

        it("should checked exist in database", async () => {
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
            };

            await request(app).post("/auth/register").send(userData);

            const response = await request(app).post("/auth/login").send({
                email: userData.email,
                password: userData.password,
            });

            const userRepository = connection.getRepository(User);

            const user = await userRepository.findOne({
                where: { email: userData.email },
            });
            expect(user).not.toBeNull();
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(user?.id);
        });

        it("should return 400 if password is wrong", async () => {
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
            };

            await request(app).post("/auth/register").send(userData);

            const response = await request(app).post("/auth/login").send({
                email: userData.email,
                password: "9876543210",
            });

            const userRepository = connection.getRepository(User);

            const user = await userRepository.findOne({
                where: { email: userData.email },
            });

            expect(response.statusCode).toBe(400);
        });

        it("should return the access token and refresh token inside a cookie", async () => {
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
            };

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const userRepository = connection.getRepository(User);

            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            const response = await request(app).post("/auth/login").send({
                email: userData.email,
                password: userData.password,
            });

            interface Headers {
                ["set-cookie"]: string[];
            }

            let accessToken = null;
            let refreshToken = null;
            const cookies =
                (response.headers as unknown as Headers)["set-cookie"] || [];

            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0]?.split("=")[1];
                }

                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0]?.split("=")[1];
                }
            });

            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });
    });
});
