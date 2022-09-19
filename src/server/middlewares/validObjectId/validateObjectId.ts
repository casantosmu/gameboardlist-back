import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import CustomError from "../../../utils/CustomError";

const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  const {
    params: { id },
  } = req;

  if (!isValidObjectId(id)) {
    const customError = new CustomError(400, "Invalid ID field in params");
    next(customError);
    return;
  }

  next();
};

export default validateObjectId;
