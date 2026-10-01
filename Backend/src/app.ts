import express from "express";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/user.routes.ts";
import TaskRoutes from "./routes/task.routes.ts";
import { API_BASE_URL } from "./constants.ts";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(`${API_BASE_URL}/users`, UserRoutes);
app.use(`${API_BASE_URL}/tasks`, TaskRoutes);

export default app;
