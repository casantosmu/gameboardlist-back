import { NextFunction, Request, Response } from "express";
import CustomError from "../../utils/CustomError";

const parseMulter = async (req: Request, res: Response, next: NextFunction) => {
  let file: Express.Multer.File;

  try {
    file = req.file;
  } catch (error) {
    const customError = new CustomError(400, "Invalid data", error.message);

    next(customError);
    return;
  }

  req.body.file = file.path;
  next();
};

export default parseMulter;
