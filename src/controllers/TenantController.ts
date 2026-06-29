import { NextFunction, Response, Request } from "express";
import { TenantService } from "../services/TenantService";
import { CreateTenantRequest } from "../types";
import { Logger } from "winston";

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}

    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body;

        this.logger.debug("Request for creating a teannt", req.body);

        try {
            const tenant = await this.tenantService.create({ name, address });

            this.logger.info(`Tenant has been created id:${tenant.id}`);

            res.status(201).json({ id: tenant.id });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantService.getAll();
            this.logger.info("All tenant have been fetched");
            res.json(tenants);
        } catch (error) {
            next(error);
        }
    }
}
