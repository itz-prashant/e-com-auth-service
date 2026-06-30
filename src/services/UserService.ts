import { Repository } from "typeorm";
import { User } from "../entities/User";
import { LimitedUserData, UserData } from "../types";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

export class UserService {
    constructor(private userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    async create({ firstName, lastName, email, password, role }: UserData) {
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
                role: role,
            });
        } catch {
            const error = createHttpError(500, "Failed to store in database");
            throw error;
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
            },
        });
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
        });
    }

    async getAll() {
        return await this.userRepository.find();
    }

    async update(id: number, { firstName, lastName, role }: LimitedUserData) {
        try {
            await this.userRepository.update(id, { firstName, lastName, role });
        } catch {
            const error = createHttpError(
                500,
                "Failed to update the user in the database",
            );
            throw error;
        }
    }

    async deleteById(userId: number) {
        return await this.userRepository.delete(userId);
    }
}
