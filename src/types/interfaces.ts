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
  id: string;
  image: string;
  imageBackup: string;
  rating: number;
  weight: number;
  name: string;
  year: Date;
  category: GameboardsCategories;
  authorship?: string;
  createdBy: string;
  players: MinMax;
  time: MinMax;
}

export type Gameboards = Array<Gameboard>;

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
