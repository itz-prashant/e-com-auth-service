import app from "./app";
import { AppDataSource } from "./config/data-source";
import { CONFIG } from "./config/index";
import logger from "./config/logger";
import { User } from "./entities/User";
import { createDefaultAdmin } from "./services/createDefaultAdmin";
import { UserService } from "./services/UserService";

const userRepository = AppDataSource.getRepository(User);
const userSerevice = new UserService(userRepository);

const startServer = async () => {
    const PORT = CONFIG.PORT;
    try {
        await AppDataSource.initialize();
        logger.info("Database connected successfully");
        await createDefaultAdmin(userSerevice);
        app.listen(PORT, () => {
            logger.info(`Server Listening on PORT ${PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

void startServer();
