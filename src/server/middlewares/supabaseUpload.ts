import { createClient } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";
import { readFile } from "fs/promises";

const supabase = createClient(
  process.env.SUPABASE_CONFIG || "",
  process.env.SUPABASE_KEY || ""
);

const supabaseUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { path, filename } = req.file;

  try {
    const fileData = await readFile(path);
    const storage = supabase.storage.from("uploads");
    const uploadResult = await storage.upload(filename, fileData);

    if (uploadResult.error) {
      next(uploadResult.error);
      return;
    }

    const { publicURL } = storage.getPublicUrl(filename);

    req.body.fileBackup = publicURL;
    next();
  } catch (error) {
    next(error);
  }
};

export default supabaseUpload;
