import { Request } from "express";
import { UserPayload } from "./user";

export interface CustomRequest<T> extends Request {
  body: T;
}

export type UserRequest<T> = CustomRequest<{
  user: T;
}>;

export interface RequestWithPayload extends Request {
  payload: UserPayload;
}
