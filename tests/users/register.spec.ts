import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
} from "@jest/globals";
import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entities/User";
import { Roles } from "../../src/contsants";
// import { truncateTables } from "../utils/utils";

describe("POST /auth/register", () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Database truncate
        await connection.dropDatabase();
        await connection.synchronize();
        // await truncateTables(connection);
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return the 201 status code", async () => {
            // AAA [Arrange, Act, Assert]

            // #Arrange
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
            };

            // #Act
            const resposne = await request(app)
                .post("/auth/register")
                .send(userData);

            // #Assert
            expect(resposne.statusCode).toBe(201);
        });

        it("should return valid JSON format", async () => {
            // AAA [Arrange, Act, Assert]

            // #Arrange
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
            };

            // #Act
            const resposne = await request(app)
                .post("/auth/register")
                .send(userData);

            // #Assert
            expect(resposne.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });

        it("should persist the user in database", async () => {
            // #Arrange
            const userData = {
                firstName: "Prashant",
                lastName: "Gupta",
                email: "prashant@gmail.com",
                password: "123456789",
            };

            // #Act
            await request(app).post("/auth/register").send(userData);

            // #Assert
            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0]?.firstName).toBe(userData.firstName);
            expect(users[0]?.lastName).toBe(userData.lastName);
            expect(users[0]?.email).toBe(userData.email);
            // expect(users[3]?.password).toBe(userData.password)
        });
    });

    it("should return an id of created user", async () => {
        const userData = {
            firstName: "Prashant",
            lastName: "Gupta",
            email: "prashant@gmail.com",
            password: "123456789",
        };

        const response = await request(app)
            .post("/auth/register")
            .send(userData);

        expect(response.body).toHaveProperty("id");

        const userRepository = connection.getRepository(User);
        const user = await userRepository.find();

        expect((response.body as Record<string, string>).id).toBe(user[0]?.id);
    });

    it("should assign a customer role", async () => {
        const userData = {
            firstName: "Prashant",
            lastName: "Gupta",
            email: "prashant@gmail.com",
            password: "123456789",
        };

        await request(app).post("/auth/register").send(userData);

        const userRepository = connection.getRepository(User);

        const user = await userRepository.find();

        expect(user[0]).toHaveProperty("role");
        expect(user[0]?.role).toBe(Roles.CUSTOMER);
    });

    it("should the store the hashed password in the data base", async () => {
        const userData = {
            firstName: "Prashant",
            lastName: "Gupta",
            email: "prashant@gmail.com",
            password: "123456789",
        };

        await request(app).post("/auth/register").send(userData);

        const userRepository = connection.getRepository(User);

        const users = await userRepository.find();

        expect(users[0]?.password).not.toBe(userData.password);
        expect(users[0]?.password).toHaveLength(60);
        expect(users[0]?.password).toMatch(/^\$2b\$\d+\$/);
    });

    describe("Fields are missing", () => {});
});
