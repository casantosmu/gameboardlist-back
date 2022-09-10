import { MinMax } from "./interfaces";

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
