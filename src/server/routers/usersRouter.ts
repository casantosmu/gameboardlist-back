import express from "express";
import { validate } from "express-validation";
import { registerUser } from "../controllers/usersControllers";
import userRegisterSchema from "../schemas/userRegisterSchema";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(userRegisterSchema, {}, { abortEarly: false }),
  registerUser
);

export default usersRouter;
