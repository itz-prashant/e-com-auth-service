import { NextFunction, Response, Request } from "express";
import { UserService } from "../services/UserService";
import { CreateUserRequest } from "../types";
import createHttpError from "http-errors";

export class UserController {
    constructor(private userSerevice: UserService) {}

    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password, tenantId, role } =
            req.body;
        try {
            const user = await this.userSerevice.create({
                firstName,
                lastName,
                email,
                password,
                role,
                tenantId,
            });
             
            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userSerevice.getAll();

            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }

        try {
            const user = await this.userSerevice.findById(Number(userId));
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async update(req: CreateUserRequest, res: Response, next: NextFunction) {
        const userId = req.params.id;
        const { firstName, lastName, role } = req.body;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }

        try {
            await this.userSerevice.update(Number(userId), {
                firstName,
                lastName,
                role,
            });
            res.json({ id: userId });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }

        try {
            await this.userSerevice.deleteById(Number(userId));
            res.json({ id: userId });
        } catch (error) {
            next(error);
        }
    }
}
