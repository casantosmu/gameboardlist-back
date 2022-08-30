import { NextFunction, Response } from "express";
import User from "../../database/models/User";
import { CustomRequest, UserRegister } from "../../types/interfaces";
import CustomError from "../../utils/CustomError";

const registerUser = async (
  req: CustomRequest<UserRegister>,
  res: Response,
  next: NextFunction
) => {
  const {
    body: {
      user: { name, email, password },
    },
  } = req;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new CustomError(400, "A user with this this email already exists");
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
    next(error);
  }
};

export default registerUser;
