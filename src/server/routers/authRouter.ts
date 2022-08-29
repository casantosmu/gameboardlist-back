import express from "express";
import register from "../controllers/authControllers";

const authRouter = express.Router();

authRouter.post("/register", register);

export default authRouter;
