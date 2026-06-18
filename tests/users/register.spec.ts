import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
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
    });

    describe("Fields are missing", () => {});
});
