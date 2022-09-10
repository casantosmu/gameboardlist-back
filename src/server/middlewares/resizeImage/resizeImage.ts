import { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import sharp from "sharp";
import path from "path";
import CustomError from "../../../utils/CustomError";

const resizeImage = async (req: Request, res: Response, next: NextFunction) => {
  const imageExtension = "webp";

  const requestFilename = slugify(path.parse(req.file.originalname).name);
  const isoDateString = new Date().toISOString().replace(/:/g, "-");

  const filename = `${isoDateString}-${requestFilename}.${imageExtension}`;
  const filePath = path.join("uploads", filename);

  try {
    await sharp(req.file.buffer)
      .resize({
        height: 250,
        width: 250,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toFormat(imageExtension)
      .toFile(filePath);

    req.body.image = filePath;

    next();
  } catch (error) {
    const customError = new CustomError(
      500,
      "Could not process image",
      error.message
    );

    next(customError);
  }
};

export default resizeImage;
