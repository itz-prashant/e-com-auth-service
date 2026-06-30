import { NextFunction, Response, Request } from "express";
import { UserService } from "../services/UserService";
import { CreateUserRequest } from "../types";
import { Roles } from "../contsants";

export class UserController {
    constructor(private userSerevice: UserService) {}

    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = req.body;
        try {
            const user = await this.userSerevice.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.MANAGER,
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
}
