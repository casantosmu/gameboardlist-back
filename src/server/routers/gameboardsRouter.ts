import express from "express";
import { validate } from "express-validation";
import {
  getGameboards,
  postGameboard,
} from "../controllers/gameboardsControllers";
import authentication from "../middlewares/authentication/authentication";
import parseMulter from "../middlewares/parseMulter/parseMulter";
import supabaseUpload from "../middlewares/supabaseUpload/supabaseUpload";
import uploadImage from "../middlewares/uploadImage/uploadImage";
import postGameboardSchema from "../schemas/postGameboardSchema";

const gameboardsRouter = express.Router();

gameboardsRouter.get("/", authentication, getGameboards);
gameboardsRouter.post(
  "/",
  authentication,
  uploadImage.single("image"),
  parseMulter,
  supabaseUpload,
  validate(postGameboardSchema),
  postGameboard
);

export default gameboardsRouter;
