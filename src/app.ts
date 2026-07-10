import "reflect-metadata";
import express from "express";
import authRouter from "./routes/auth";
import tenantRouter from "./routes/tenant";
import userRouter from "./routes/user";
import cookieParser from "cookie-parser";
import cors from "cors";
import { CONFIG } from "./config";
import { globalErrorhandler } from "./middlewares/globalErrorHandler";

const app = express();

app.use(
    cors({
        origin: [CONFIG.ADMIN_DASHBOARD_BASE_URL!],
        credentials: true,
    }),
);

app.use(express.static("public", { dotfiles: "allow" }));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Welcome to auth servicse");
});

app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);
app.use("/users", userRouter);

// Global error handler
app.use(globalErrorhandler);

export default app;
