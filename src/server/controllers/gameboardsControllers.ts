import { NextFunction, Request, Response } from "express";
import Gameboard from "../../database/models/Gameboard";
import { Gameboard as IGameboard } from "../../types/gameboard";
import { CustomRequest } from "../../types/interfaces";
import { UserPayload } from "../../types/user";

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
  req: CustomRequest<IGameboard>,
  res: Response,
  next: NextFunction
) => {
  const { image, ...gameboard } = req.body;

  const imagePath = `${process.env.BASE_URL}/${image}`;

  try {
    await Gameboard.create({
      ...gameboard,
      image: imagePath,
    });

    res.status(201).json({ sucess: "Boardgame created successfully" });
  } catch (error) {
    next(error);
  }
};
