import express from "express";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../contsants";
import { UserController } from "../controllers/UserColtroller";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userSerevice = new UserService(userRepository);
const userController = new UserController(userSerevice);

router.post("/", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.create(req, res, next),
);

router.get("/", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.getAll(req, res, next),
);

export default router;
