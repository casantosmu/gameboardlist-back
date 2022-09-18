import { NextFunction, Request, Response } from "express";
import Gameboard from "../../database/models/Gameboard";
import { Gameboard as IGameboard } from "../../types/gameboard";
import { UserPayload } from "../../types/user";
import CustomError from "../../utils/CustomError";

interface RequestWithPayload extends Request {
  payload: UserPayload;
}

export const getGameboards = async (
  req: RequestWithPayload,
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
  req: RequestWithPayload,
  res: Response,
  next: NextFunction
) => {
  const gameboard = req.body;
  const userId = req.payload.id;

  gameboard.createdBy = userId;

  try {
    const createdGameboard = await Gameboard.create(gameboard);

    res.status(201).json({ gameboard: createdGameboard });
  } catch (error) {
    next(error);
  }
};

export const deleteGameboard = async (
  req: RequestWithPayload,
  res: Response,
  next: NextFunction
) => {
  const {
    payload: { id: userId },
    params: { id: gameboardId },
  } = req;

  let gameboardFound: IGameboard;
  try {
    gameboardFound = await Gameboard.findByIdAndRemove({
      _id: gameboardId,
      createdBy: userId,
    });
  } catch (error) {
    next(error);
    return;
  }

  if (!gameboardFound) {
    const customError = new CustomError(
      404,
      `No gameboard with id ${gameboardId}`
    );
    next(customError);
    return;
  }

  res.status(204).send();
};

export const getGameboard = async (
  req: RequestWithPayload,
  res: Response,
  next: NextFunction
) => {
  const {
    payload: { id: userId },
    params: { id: gameboardId },
  } = req;

  let gameboardFound: IGameboard;
  try {
    gameboardFound = await Gameboard.findOne({
      _id: gameboardId,
      createdBy: userId,
    });
  } catch (error) {
    next(error);
    return;
  }

  if (!gameboardFound) {
    const customError = new CustomError(
      404,
      `No gameboard with id ${gameboardId}`
    );
    next(customError);
    return;
  }

  res.status(200).json({ gameboard: gameboardFound });
};
