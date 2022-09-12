import "../../loadEnvironment";
import { Request, Response } from "express";
import Gameboard from "../../database/models/Gameboard";
import fakeGameboard from "../../test-utils/fakeGameboard";
import { UserPayload } from "../../types/user";
import { getGameboards, postGameboard } from "./gameboardsControllers";

interface GetRequest extends Request {
  payload: UserPayload;
}

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given a getGameboards controller", () => {
  describe("When it recives a request and a response", () => {
    test("Then it should call gameboard.find with id 'ID' from req", async () => {
      const req = {
        payload: {
          id: "ID",
        },
      } as Partial<GetRequest>;
      const res = {} as Response;
      const next = () => {};

      Gameboard.find = jest.fn();

      const expectedQuery = {
        createdBy: req.payload.id,
      };

      await getGameboards(req as GetRequest, res, next);

      expect(Gameboard.find).toHaveBeenCalledWith(expectedQuery);
    });

    describe("And gameboard.find returns the list of games of the id", () => {
      test("Then it should call the response method with a status 200", async () => {
        const req = {
          payload: {
            id: "",
          },
        } as Partial<GetRequest>;
        const res = {
          status: jest.fn(),
        } as Partial<Response>;
        const next = () => {};

        const expectedStatus = 200;

        Gameboard.find = jest.fn();

        await getGameboards(req as GetRequest, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });

      test("Then it should call the json method with the list of games", async () => {
        const req = {
          payload: {
            id: "",
          },
        } as Partial<GetRequest>;
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as Partial<Response>;
        const next = () => {};

        const games = ["game1", "game2"];
        const expectedGames = { gameboards: games };

        Gameboard.find = jest.fn().mockReturnValue(games);

        await getGameboards(req as GetRequest, res as Response, next);

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
          } as Partial<GetRequest>;
          const res = {} as Response;
          const next = jest.fn();

          const error = new Error();

          Gameboard.find = jest.fn().mockRejectedValue(error);

          await getGameboards(req as GetRequest, res, next);

          expect(next).toHaveBeenCalledWith(error);
        });
      });
    });
  });
});

describe("Given a postGambeoard controller", () => {
  const req = {
    body: fakeGameboard,
  } as Partial<Request>;

  describe("When it recives a request and a response", () => {
    test("Then it should call Gameboard create with the request body", async () => {
      const res = {} as Response;
      const next = () => {};
      Gameboard.create = jest.fn();

      const expectedGameboard = {
        ...fakeGameboard,
        image: `${process.env.BASE_URL}/${fakeGameboard.image}`,
      };

      await postGameboard(req as Request, res, next);

      expect(Gameboard.create).toHaveBeenCalledWith(expectedGameboard);
    });

    test("Then it should call the response status method with 201", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = () => {};

      Gameboard.create = jest.fn().mockReturnValue({});

      const expectedStatusCode = 201;

      await postGameboard(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call the response json method with a success message", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = () => {};

      const expectedSuccessMessage = {
        success: "Boardgame created successfully",
      };

      Gameboard.create = jest.fn().mockReturnValue({});

      await postGameboard(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedSuccessMessage);
    });
  });

  describe("When it recives a next function and User.create rejects", () => {
    test("Then it should call next function with the an error", async () => {
      const res = {} as Response;
      const next = jest.fn();

      const error = new Error();

      Gameboard.create = jest.fn().mockRejectedValue(error);

      await postGameboard(req as Request, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
