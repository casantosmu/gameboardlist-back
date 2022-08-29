import { NextFunction, Response } from "express";
import User from "../../database/models/User";
import { CustomRequest } from "../../types/interfaces";
import CustomError from "../../utils/CustomError";

interface UserRegister {
  user: {
    name: string;
    email: string;
    password: string;
  };
}

const register = async (
  req: CustomRequest<UserRegister>,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;

  try {
    if (!body.user.name || !body.user.email || !body.user.password) {
      throw new CustomError(400, "Please provide all details");
    }
  } catch (error) {
    next(error);
    return;
  }

  const {
    user: { name, email, password },
  } = body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new CustomError(400, `'A user with this this email already exists`);
    }
  } catch (error) {
    next(error);
    return;
  }

  try {
    await User.create({
      name,
      email,
      password,
    });

    res.status(200).json({ sucess: "User has been registered" });
  } catch (error) {
    let responseError = error;

    if (error.name === "ValidationError") {
      responseError = new CustomError(
        400,
        "Could not create user due to some invalid fields!",
        error.message
      );
    }

    next(responseError);
  }
};

export default register;
