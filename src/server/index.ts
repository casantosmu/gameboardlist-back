import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { generalError, notFoundError } from "./middlewares/errors";
import usersRouter from "./routers/usersRouter";
import gameboardsRouter from "./routers/gameboardsRouter";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));

app.use("/users", usersRouter);
app.use("/gameboards", gameboardsRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
