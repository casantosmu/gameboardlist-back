import express from "express";
import getGameboards from "../controllers/gameboardsControllers";
import authentication from "../middlewares/authentication";

const gameboardsRouter = express.Router();

gameboardsRouter.get("/", authentication, getGameboards);

export default gameboardsRouter;
