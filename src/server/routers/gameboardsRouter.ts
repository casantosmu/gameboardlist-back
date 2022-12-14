import express from "express";
import { validate } from "express-validation";
import {
  deleteGameboard,
  getGameboard,
  getGameboards,
  postGameboard,
} from "../controllers/gameboardsControllers";
import authentication from "../middlewares/authentication/authentication";
import checkRequestFile from "../middlewares/checkRequestFile/checkRequestFile";
import resizeImage from "../middlewares/resizeImage/resizeImage";
import supabaseImage from "../middlewares/supabaseImage/supabaseImage";
import uploadImage from "../middlewares/uploadImage/uploadImage";
import validateObjectId from "../middlewares/validObjectId/validateObjectId";
import postGameboardSchema from "../schemas/postGameboardSchema";

const gameboardsRouter = express.Router();

gameboardsRouter.get("/", authentication, getGameboards);
gameboardsRouter.post(
  "/",
  authentication,
  uploadImage.single("image"),
  checkRequestFile,
  resizeImage,
  supabaseImage,
  validate(postGameboardSchema),
  postGameboard
);
gameboardsRouter.delete(
  "/:id",
  authentication,
  validateObjectId,
  deleteGameboard
);
gameboardsRouter.get("/:id", authentication, validateObjectId, getGameboard);

export default gameboardsRouter;
