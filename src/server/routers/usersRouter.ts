import express from "express";
import { validate } from "express-validation";
import { loginUser, registerUser } from "../controllers/usersControllers";
import userLoginSchema from "../schemas/userLoginSchema";
import userRegisterSchema from "../schemas/userRegisterSchema";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(userRegisterSchema, {}, { abortEarly: false }),
  registerUser
);

usersRouter.post(
  "/login",
  validate(userLoginSchema, {}, { abortEarly: false }),
  loginUser
);

export default usersRouter;
