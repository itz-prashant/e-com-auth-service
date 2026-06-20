import { Repository } from "typeorm";
import { User } from "../entities/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../contsants";
import bcrypt from "bcrypt";

export class UserService {
    constructor(private userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    async create({ firstName, lastName, email, password }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });

        if (user) {
            const error = createHttpError(400, "Email is already exist");
            throw error;
        }

        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });
        } catch {
            const error = createHttpError(500, "Failed to store in database");
            throw error;
        }
    }
}
