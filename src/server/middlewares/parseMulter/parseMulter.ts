import { NextFunction, Request, Response } from "express";
import CustomError from "../../../utils/CustomError";

const parseMulter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file } = req;
    req.body.file = file.path;
  } catch (error) {
    const customError = new CustomError(
      400,
      "You must add a file to the request",
      error.message
    );
    next(customError);
    return;
  }

  next();
};

export default parseMulter;
