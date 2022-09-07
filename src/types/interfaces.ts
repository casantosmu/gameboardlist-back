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

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface Gameboard {
  image: string;
  rating: number;
  name: string;
  year: Date;
  category: GameboardsCategories;
  authorship: string;
  createdBy: string;
  players?: MinMax;
  time?: MinMax;
}

export type Gameboards = Array<Gameboards>;

export type GameboardsCategories =
  | "party"
  | "family"
  | "thematic"
  | "wargame"
  | "strategy";

interface MinMax {
  min: number;
  max: number;
}
