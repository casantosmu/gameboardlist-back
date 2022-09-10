import { Request, Response } from "express";
import Gameboard from "../../database/models/Gameboard";
import { UserPayload } from "../../types/user";
import { getGameboards } from "./gameboardsControllers";

interface CustomRequest extends Request {
  payload: UserPayload;
}

describe("Given a getGameboards function", () => {
  describe("When it recives a request and a response", () => {
    test("Then it should call gameboard.find with id 'ID' from req", async () => {
      const req = {
        payload: {
          id: "ID",
        },
      } as Partial<CustomRequest>;
      const res = {} as Response;
      const next = () => {};

      Gameboard.find = jest.fn();

      const expectedQuery = {
        createdBy: req.payload.id,
      };

      await getGameboards(req as CustomRequest, res, next);

      expect(Gameboard.find).toHaveBeenCalledWith(expectedQuery);
    });

    describe("And gameboard.find returns the list of games of the id", () => {
      test("Then it should call the response method with a status 200", async () => {
        const req = {
          payload: {
            id: "",
          },
        } as Partial<CustomRequest>;
        const res = {
          status: jest.fn(),
        } as Partial<Response>;
        const next = () => {};

        const expectedStatus = 200;

        Gameboard.find = jest.fn();

        await getGameboards(req as CustomRequest, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });

      test("Then it should call the json method with the list of games", async () => {
        const req = {
          payload: {
            id: "",
          },
        } as Partial<CustomRequest>;
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as Partial<Response>;
        const next = () => {};

        const games = ["game1", "game2"];
        const expectedGames = { gameboards: games };

        Gameboard.find = jest.fn().mockReturnValue(games);

        await getGameboards(req as CustomRequest, res as Response, next);

        expect(res.json).toHaveBeenCalledWith(expectedGames);
      });
    });

    describe("When it recives a request and a next functions", () => {
      describe("And gameboard.find rejects with an an error", () => {
        test("Then it should call next function the error ", async () => {
          const req = {
            payload: {
              id: "",
            },
          } as Partial<CustomRequest>;
          const res = {} as Partial<Response>;
          const next = jest.fn();

          const error = new Error();

          Gameboard.find = jest.fn().mockRejectedValue(error);

          await getGameboards(req as CustomRequest, res as Response, next);

          expect(next).toHaveBeenCalledWith(error);
        });
      });
    });
  });
});
