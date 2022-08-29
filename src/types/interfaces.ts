import { Request } from "express";

export interface CustomRequest<T> extends Request {
  body: T;
}

export interface UserRegister {
  user: {
    name: string;
    email: string;
    password: string;
  };
}
