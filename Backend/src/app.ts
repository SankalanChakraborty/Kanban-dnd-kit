import express from "express";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/user.routes.ts";
import TaskRoutes from "./routes/task.routes.ts";
import { USER_BASE_URL, TASK_BASE_URL } from "./constants.ts";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(`${USER_BASE_URL}`, UserRoutes);
app.use(`${TASK_BASE_URL}`, TaskRoutes);

export default app;
