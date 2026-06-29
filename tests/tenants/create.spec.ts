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
import { Tenant } from "../../src/entities/Tenant";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/contsants";

describe("POST /tenants", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    let admintToken: string;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
        jwks.start();

        admintToken = jwks.token({
            sub: "1",
            role: Roles.ADMIN,
        });
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return a 201 status code", async () => {
            const tenantData = {
                name: "Tenant name",
                address: "Tenant address",
            };

            const response = await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${admintToken}`])
                .send(tenantData);

            expect(response.statusCode).toBe(201);
        });

        it("should create a tenant in database", async () => {
            const tenantData = {
                name: "Tenant name",
                address: "Tenant address",
            };

            await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${admintToken}`])
                .send(tenantData);

            const tenantRepo = connection.getRepository(Tenant);

            const tenants = await tenantRepo.find();

            expect(tenants).toHaveLength(1);
            expect(tenants[0]?.name).toBe(tenantData.name);
            expect(tenants[0]?.address).toBe(tenantData.address);
        });

        it("should return 401 if user not authenticated", async () => {
            const tenantData = {
                name: "Tenant name",
                address: "Tenant address",
            };

            const response = await request(app)
                .post("/tenants")
                .send(tenantData);

            const tenantRepo = connection.getRepository(Tenant);

            const tenants = await tenantRepo.find();

            expect(tenants).toHaveLength(0);
            expect(response.status).toBe(401);
        });

        it("should return 403 if user not an admin", async () => {
            const tenantData = {
                name: "Tenant name",
                address: "Tenant address",
            };

            const managerToken = jwks.token({
                sub: "1",
                role: Roles.MANAGER,
            });

            const response = await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${managerToken}`])
                .send(tenantData);

            const tenantRepo = connection.getRepository(Tenant);

            const tenants = await tenantRepo.find();

            expect(response.status).toBe(403);
            expect(tenants).toHaveLength(0);
        });
    });
});
