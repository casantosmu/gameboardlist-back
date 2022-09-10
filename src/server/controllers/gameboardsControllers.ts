import { NextFunction, Request, Response } from "express";
import Gameboard from "../../database/models/Gameboard";
import { UserPayload } from "../../types/interfaces";

interface GetRequest extends Request {
  payload: UserPayload;
}

export const getGameboards = async (
  req: GetRequest,
  res: Response,
  next: NextFunction
) => {
  const queryObject = {
    createdBy: req.payload.id,
  };

  try {
    const gameboards = await Gameboard.find(queryObject);

    res.status(200).json({ gameboards });
  } catch (error) {
    next(error);
  }
};

export const postGameboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const gameboard = req.body;

  try {
    await Gameboard.create({
      ...gameboard,
      image: gameboard.file,
      imageBackup: gameboard.fileBackup,
    });

    res.status(201).json({ sucess: "Boardgame created successfully" });
  } catch (error) {
    next(error);
  }
};
