import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.disable("x-powered-by");

app.get("/", (_, res) => {
  res.send("Hello World!");
});

export default app;
