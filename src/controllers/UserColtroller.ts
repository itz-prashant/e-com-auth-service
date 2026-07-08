import { NextFunction, Response, Request } from "express";
import { UserService } from "../services/UserService";
import { CreateUserRequest, UserQueryParams } from "../types";
import createHttpError from "http-errors";
import { matchedData } from "express-validator";

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
        const validatedQuery = matchedData(req, { onlyValidData: true });
        try {
            const [user, count] = await this.userSerevice.getAll(
                validatedQuery as UserQueryParams,
            );

            res.json({
                data: user,
                currentPage: validatedQuery.currentPage as number,
                perPage: validatedQuery.perPage as number,
                total: count,
            });
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
