import { NextFunction, Request, Response } from "express";
import CustomError from "../../../utils/CustomError";

const checkRequestFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req?.file) {
    const customError = new CustomError(
      400,
      "You must add a file to the request"
    );
    next(customError);
    return;
  }
  next();
};

export default checkRequestFile;
