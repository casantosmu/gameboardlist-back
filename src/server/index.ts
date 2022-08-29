import express from "express";
import cors from "cors";
import morgan from "morgan";
import { generalError, notFoundError } from "./middlewares/errors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.disable("x-powered-by");

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.use(notFoundError);
app.use(generalError);

export default app;
