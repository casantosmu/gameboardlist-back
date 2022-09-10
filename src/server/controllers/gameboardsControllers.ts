import { NextFunction, Request, Response } from "express";
import Gameboard from "../../database/models/Gameboard";
import { Gameboard as IGameboard } from "../../types/gameboard";
import { CustomRequest } from "../../types/interfaces";
import { UserPayload } from "../../types/user";

interface GetRequest extends Request {
  payload: UserPayload;
}

interface RequestGameboard extends IGameboard {
  file: string;
  fileBackup: string;
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
  req: CustomRequest<RequestGameboard>,
  res: Response,
  next: NextFunction
) => {
  const { file, fileBackup, ...gameboard } = req.body;

  try {
    await Gameboard.create({
      ...gameboard,
      image: file,
      imageBackup: fileBackup,
    });

    res.status(201).json({ sucess: "Boardgame created successfully" });
  } catch (error) {
    next(error);
  }
};
