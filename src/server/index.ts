import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { generalError, notFoundError } from "./middlewares/errors/errors";
import usersRouter from "./routers/usersRouter";
import gameboardsRouter from "./routers/gameboardsRouter";

const HelmetOptions = {
  crossOriginResourcePolicy: false,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many request from this IP, please try again after an hour",
});

const app = express();

app.use(express.json());
app.use(helmet(HelmetOptions));
app.use(cors());
app.use(morgan("dev"));
app.use(limiter);

app.use("/uploads", express.static("uploads"));
app.use("/users", usersRouter);
app.use("/gameboards", gameboardsRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
