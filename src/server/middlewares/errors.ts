import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import CustomError from "../../utils/CustomError";

const debug = Debug("gameboardlist:server:errors");

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let status = error.status ?? 500;
  let publicMessage = error.publicMessage ?? "Internal server error";
  const privateMessage = error.privateMessage ?? error.message;

  if (error instanceof ValidationError) {
    status = 400;
    publicMessage = "Invalid data";

    debug(chalk.blue("Invalidation request data:"));

    error.details.body.forEach((errorInfo) => {
      debug(chalk.yellowBright(errorInfo.message));
    });
  }

  debug(chalk.red(privateMessage));

  res.status(status).json({ error: publicMessage });
};
