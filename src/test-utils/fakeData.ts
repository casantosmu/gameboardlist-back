import { Gameboard } from "../types/gameboard";

export const fakeGameboard: Gameboard = {
  id: "2",
  image: "fewfw",
  imageBackup: "fwef",
  rating: 8,
  name: "The Castles of Burgundy",
  year: 2011,
  category: "strategy",
  authorship: "Stefan Feld",
  createdBy: "fwe",
  players: {
    min: 2,
    max: 4,
  },
  time: {
    min: 30,
    max: 90,
  },
  weight: 3,
};
