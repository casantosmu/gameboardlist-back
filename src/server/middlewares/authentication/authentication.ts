import { NextFunction, Response } from "express";
import { RequestWithPayload } from "../../../types/requests";
import { UserPayload } from "../../../types/user";
import { verifyToken } from "../../../utils/authentication";
import CustomError from "../../../utils/CustomError";

const authentication = (
  req: RequestWithPayload,
  res: Response,
  next: NextFunction
) => {
  const authenticationHeader = req.get("Authorization");

  const authenticationError = new CustomError(401, "Invalid authentication");

  if (!authenticationHeader || !authenticationHeader.startsWith("Bearer ")) {
    next(authenticationError);
    return;
  }

  const token = authenticationHeader.split(" ")[1];

  try {
    const payload = verifyToken(token) as UserPayload;
    req.payload = payload;

    next();
  } catch (error) {
    if (error instanceof Error) {
      authenticationError.privateMessage = error.message;
    }

    next(authenticationError);
  }
};

export default authentication;
