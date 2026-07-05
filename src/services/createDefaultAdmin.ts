import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { Roles } from "../contsants";
import { User } from "../entities/User";
import { UserService } from "./UserService";

export const createDefaultAdmin = async (userService: UserService) => {
    const userRepository = AppDataSource.getRepository(User);
    // Check if admin already exists
    const admin = await userRepository.findOne({
        where: {
            role: Roles.ADMIN,
        },
    });

    if (admin) {
        logger.info("Admin user already exists");
        return;
    }

    await userService.create({
        firstName: "Prashant",
        lastName: "Gupta",
        email: "admin@gmail.com",
        password: "123456789",
        role: Roles.ADMIN,
    });

    logger.info("Default admin created successfully");
};
