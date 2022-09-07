import { NextFunction, Request, Response } from "express";
import Gameboard from "../../database/models/Gameboard";
import { UserPayload } from "../../types/interfaces";

interface CustomRequest extends Request {
  payload: UserPayload;
}

const getGameboards = async (
  req: CustomRequest,
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

export default getGameboards;
