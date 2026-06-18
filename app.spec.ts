import { describe, expect, it } from "@jest/globals";
import { calculateDiscount } from "./src/utils";
import request from "supertest";
import app from "./src/app";

describe.skip("App", () => {
    it("should return correct discount amount", () => {
        const discount = calculateDiscount(100, 10);

        expect(discount).toBe(10);
    });

    it("should return 200 status code", async () => {
        const resposne = await request(app).get("/").send();
        expect(resposne.statusCode).toBe(200);
    });
});
