import { Request } from "express";

export interface CustomRequest<T> extends Request {
  body: T;
}

export interface UserRequest<T> {
  user: T;
}

export interface UserRegister {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserPayload {
  id: string;
  name: string;
  email: string;
}
