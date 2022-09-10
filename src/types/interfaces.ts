import { Request } from "express";

export interface CustomRequest<T> extends Request {
  body: T;
}

export interface UserRequest<T> {
  user: T;
}

export interface MinMax {
  min: number;
  max: number;
}
