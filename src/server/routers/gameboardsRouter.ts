import express from "express";
import { validate } from "express-validation";
import {
  getGameboards,
  postGameboard,
} from "../controllers/gameboardsControllers";
import authentication from "../middlewares/authentication";
import parseMulter from "../middlewares/parseMulter";
import supabaseUpload from "../middlewares/supabaseUpload";
import uploadImage from "../middlewares/uploadImage";
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
