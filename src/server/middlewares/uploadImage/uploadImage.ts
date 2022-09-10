import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import CustomError from "../../../utils/CustomError";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, "-")}-${file.originalname}`
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
    cb(new CustomError(422, "Only jpg, jpeg, png formats are allowed"));
  }
  cb(null, true);
};

const uploadImage = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

export default uploadImage;
