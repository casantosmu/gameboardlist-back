import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import CustomError from "../../../utils/CustomError";

const storage = multer.memoryStorage();

const limits = {
  fileSize: 8000000,
};

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image")) {
    cb(new CustomError(422, "Only images allowed"));
  }
  cb(null, true);
};

const uploadImage = multer({ storage, fileFilter, limits });

export default uploadImage;
