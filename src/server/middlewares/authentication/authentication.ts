import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../../utils/authentication";
import CustomError from "../../../utils/CustomError";

interface AuthenticationRequest extends Request {
  payload: JwtPayload;
}

const authentication = (
  req: AuthenticationRequest,
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
    const payload = verifyToken(token);
    req.payload = payload as JwtPayload;

    next();
  } catch (error) {
    if (error instanceof Error) {
      authenticationError.privateMessage = error.message;
    }

    next(authenticationError);
  }
};

export default authentication;
