import { NextFunction, Response } from "express";
import User from "../../database/models/User";
import { UserRequest } from "../../types/requests";
import { UserLogin, UserPayload, UserRegister } from "../../types/user";
import {
  getEncriptedData,
  getToken,
  isEqualEncripted,
} from "../../utils/authentication";
import CustomError from "../../utils/CustomError";

export const registerUser = async (
  req: UserRequest<UserRegister>,
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
      throw new CustomError(409, "A user with this email already exists");
    }
  } catch (error) {
    next(error);
    return;
  }

  let encriptedPassword: string;
  try {
    encriptedPassword = await getEncriptedData(password);
  } catch (error) {
    next(error);
    return;
  }

  try {
    await User.create({
      name,
      email,
      password: encriptedPassword,
    });

    res.status(201).json({ success: "User has been registered" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: UserRequest<UserLogin>,
  res: Response,
  next: NextFunction
) => {
  const {
    body: {
      user: { email, password },
    },
  } = req;

  const customError = new CustomError(401, "User or password does not exist");

  let foundUser;
  try {
    foundUser = await User.findOne({ email });

    if (foundUser === null) throw customError;
  } catch (error) {
    next(error);
    return;
  }

  let hashedPassword;
  try {
    hashedPassword = await isEqualEncripted(password, foundUser.password);

    if (!hashedPassword) throw customError;
  } catch (error) {
    next(error);
    return;
  }

  const payload: UserPayload = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
  };

  const response = {
    user: {
      token: getToken(payload),
    },
  };

  res.status(200).json(response);
};
