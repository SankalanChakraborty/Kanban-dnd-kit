import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/user.routes.js";
import TaskRoutes from "./routes/task.routes.js";
import { USER_BASE_URL, TASK_BASE_URL } from "./constants.js";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
    credentials: true,
}));
app.get("/health", (_req, res) => {
    const databaseReady = mongoose.connection.readyState === 1;
    res.status(databaseReady ? 200 : 503).json({
        status: databaseReady ? "ok" : "unavailable",
    });
});
app.use(`${USER_BASE_URL}`, UserRoutes);
app.use(`${TASK_BASE_URL}`, TaskRoutes);
export default app;
//# sourceMappingURL=app.js.map