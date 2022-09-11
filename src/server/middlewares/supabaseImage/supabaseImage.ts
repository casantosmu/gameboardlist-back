import { createClient } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";
import { readFile } from "fs/promises";
import path from "path";

const supabase = createClient(
  process.env.SUPABASE_CONFIG || "fakeconfig",
  process.env.SUPABASE_KEY || "fakekey"
);

const supabaseImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { image } = req.body;

  const filename = path.basename(image);

  try {
    const fileData = await readFile(image);
    const storage = supabase.storage.from("uploads");
    const uploadResult = await storage.upload(filename, fileData);

    if (uploadResult.error) {
      next(uploadResult.error);
      return;
    }

    const { publicURL } = storage.getPublicUrl(filename);

    req.body.imageBackup = publicURL;
    next();
  } catch (error) {
    next(error);
  }
};

export default supabaseImage;
