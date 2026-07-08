import express, { Request, Response, NextFunction } from "express";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../contsants";
import { UserController } from "../controllers/UserColtroller";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import listUserValidator from "../validators/list-user-validator";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userSerevice = new UserService(userRepository);
const userController = new UserController(userSerevice);

router.post("/", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.create(req, res, next),
);

router.get(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    listUserValidator,
    (req: Request, res: Response, next: NextFunction) =>
        userController.getAll(req, res, next),
);

router.get("/:id", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.getOne(req, res, next),
);

router.patch("/:id", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.update(req, res, next),
);

router.delete(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => userController.delete(req, res, next),
);

export default router;
