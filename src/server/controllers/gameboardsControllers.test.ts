import "../../loadEnvironment";
import { Request, Response } from "express";
import Gameboard from "../../database/models/Gameboard";
import { fakeGameboard } from "../../utils/test-utils/fakeData";
import {
  deleteGameboard,
  getGameboard,
  getGameboards,
  postGameboard,
} from "./gameboardsControllers";
import { RequestWithPayload } from "../../types/requests";

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
      } as Partial<RequestWithPayload>;
      const res = {} as Response;
      const next = () => {};

      Gameboard.find = jest.fn();

      const expectedQuery = {
        createdBy: req.payload.id,
      };

      await getGameboards(req as RequestWithPayload, res, next);

      expect(Gameboard.find).toHaveBeenCalledWith(expectedQuery);
    });

    describe("And gameboard.find returns the list of games of the id", () => {
      test("Then it should call the response method with a status 200", async () => {
        const req = {
          payload: {
            id: "",
          },
        } as Partial<RequestWithPayload>;
        const res = {
          status: jest.fn(),
        } as Partial<Response>;
        const next = () => {};

        const expectedStatus = 200;

        Gameboard.find = jest.fn();

        await getGameboards(req as RequestWithPayload, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });

      test("Then it should call the json method with the list of games", async () => {
        const req = {
          payload: {
            id: "",
          },
        } as Partial<RequestWithPayload>;
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as Partial<Response>;
        const next = () => {};

        const games = ["game1", "game2"];
        const expectedGames = { gameboards: games };

        Gameboard.find = jest.fn().mockReturnValue(games);

        await getGameboards(req as RequestWithPayload, res as Response, next);

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
          } as Partial<RequestWithPayload>;
          const res = {} as Response;
          const next = jest.fn();

          const error = new Error();

          Gameboard.find = jest.fn().mockRejectedValue(error);

          await getGameboards(req as RequestWithPayload, res, next);

          expect(next).toHaveBeenCalledWith(error);
        });
      });
    });
  });
});

describe("Given a postGambeoard controller", () => {
  const req = {
    body: fakeGameboard,
    payload: {
      id: "ID",
    },
  } as Partial<RequestWithPayload>;

  describe("When it recives a request and a response", () => {
    test("Then it should call Gameboard.create with the request body and id from payload", async () => {
      const res = {} as Response;
      const next = () => {};
      Gameboard.create = jest.fn();

      const expectedGameboard = {
        ...fakeGameboard,
        createdBy: req.payload.id,
      };

      await postGameboard(req as RequestWithPayload, res, next);

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

      await postGameboard(req as RequestWithPayload, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call the response json method with the created gameboard", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = () => {};

      const createdGameboard = fakeGameboard;
      const expectedResult = { gameboard: createdGameboard };

      Gameboard.create = jest.fn().mockReturnValue(createdGameboard);

      await postGameboard(req as RequestWithPayload, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe("When it recives a next function and User.create rejects", () => {
    test("Then it should call next function with the an error", async () => {
      const res = {} as Response;
      const next = jest.fn();

      const error = new Error();

      Gameboard.create = jest.fn().mockRejectedValue(error);

      await postGameboard(req as RequestWithPayload, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getGameboard controller", () => {
  describe("When its called with a request with userId on payload and gameboard id on params", () => {
    test("Then it should call Gameboard findOne with the recived id's", async () => {
      const gameboardId = "gameboardId";
      const userId = "userId";

      const req = {
        params: {
          id: gameboardId,
        },
        payload: {
          id: userId,
        },
      } as Partial<Request>;
      const res = {} as Response;
      const next = () => {};

      Gameboard.findOne = jest.fn();

      await getGameboard(req as RequestWithPayload, res, next);

      expect(Gameboard.findOne).toHaveBeenCalledWith({
        _id: gameboardId,
        createdBy: userId,
      });
    });
  });

  describe("When it recives a next function", () => {
    describe("And User.findOne rejects with an error", () => {
      test("Then it should call next function with the error", async () => {
        const errorMessage = "Error message";
        const error = new Error(errorMessage);

        const req = {
          params: {
            id: "",
          },
          payload: {
            id: "",
          },
        } as Partial<Request>;
        const res = {} as Response;
        const next = jest.fn();

        Gameboard.findOne = jest.fn().mockRejectedValue(error);

        await getGameboard(req as RequestWithPayload, res, next);

        const nextParameter = next.mock.calls[0][0];

        expect(nextParameter.message).toBe(errorMessage);
      });
    });

    describe("And User.findOne returns null", () => {
      test("Then it should call next function with a custom error", async () => {
        const gameboardId = "gameboardId";
        const expectedStatus = 404;
        const expectedPublicMessage = `No gameboard with id ${gameboardId}`;

        const req = {
          params: {
            id: gameboardId,
          },
          payload: {
            id: "",
          },
        } as Partial<Request>;
        const res = {} as Response;
        const next = jest.fn();

        Gameboard.findOne = jest.fn().mockResolvedValue(null);

        await getGameboard(req as RequestWithPayload, res, next);

        const nextParameter = next.mock.calls[0][0];

        expect(nextParameter.publicMessage).toBe(expectedPublicMessage);
        expect(nextParameter.status).toBe(expectedStatus);
      });
    });
  });

  describe("When it recives a response and Gameboard findOne returns an user", () => {
    const req = {
      params: {
        id: "",
      },
      payload: {
        id: "",
      },
    } as Partial<Request>;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = () => {};

    test("Then it should call the response method with a status 201", async () => {
      const expectedStatus = 200;

      Gameboard.findOne = jest.fn().mockResolvedValue({});

      await getGameboard(req as RequestWithPayload, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the json method with the user returned by Gameboard findOne", async () => {
      const gameboard = {
        gameboard: "gameboard!",
      };

      Gameboard.findOne = jest.fn().mockResolvedValue(gameboard);

      await getGameboard(req as RequestWithPayload, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ gameboard });
    });
  });
});

describe("Given a deleteGameboard controller", () => {
  describe("When its called with a request with userId on payload and gameboard id on params", () => {
    test("Then it should call Gameboard findByIdAndRemove with the recived id's", async () => {
      const gameboardId = "gameboardId";
      const userId = "userId";

      const req = {
        params: {
          id: gameboardId,
        },
        payload: {
          id: userId,
        },
      } as Partial<Request>;
      const res = {} as Response;
      const next = () => {};

      Gameboard.findByIdAndRemove = jest.fn();

      await deleteGameboard(req as RequestWithPayload, res, next);

      expect(Gameboard.findByIdAndRemove).toHaveBeenCalledWith({
        _id: gameboardId,
        createdBy: userId,
      });
    });
  });

  describe("When it recives a next function", () => {
    describe("And Gameboard findByIdAndRemove rejects with an error", () => {
      test("Then it should call next function with the error", async () => {
        const errorMessage = "Error message";
        const error = new Error(errorMessage);

        const req = {
          params: {
            id: "",
          },
          payload: {
            id: "",
          },
        } as Partial<Request>;
        const res = {} as Response;
        const next = jest.fn();

        Gameboard.findByIdAndRemove = jest.fn().mockRejectedValue(error);

        await deleteGameboard(req as RequestWithPayload, res, next);

        const nextParameter = next.mock.calls[0][0];

        expect(nextParameter.message).toBe(errorMessage);
      });
    });

    describe("And Gameboard findByIdAndRemove returns null", () => {
      test("Then it should call next function with a custom error", async () => {
        const gameboardId = "gameboardId";
        const expectedStatus = 404;
        const expectedPublicMessage = `No gameboard with id ${gameboardId}`;

        const req = {
          params: {
            id: gameboardId,
          },
          payload: {
            id: "",
          },
        } as Partial<Request>;
        const res = {} as Response;
        const next = jest.fn();

        Gameboard.findByIdAndRemove = jest.fn().mockResolvedValue(null);

        await deleteGameboard(req as RequestWithPayload, res, next);

        const nextParameter = next.mock.calls[0][0];

        expect(nextParameter.publicMessage).toBe(expectedPublicMessage);
        expect(nextParameter.status).toBe(expectedStatus);
      });
    });
  });

  describe("When it recives a response and Gameboard findByIdAndRemove returns an user", () => {
    const req = {
      params: {
        id: "",
      },
      payload: {
        id: "",
      },
    } as Partial<Request>;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;
    const next = () => {};

    test("Then it should call the response method with a status 204", async () => {
      const expectedStatus = 204;

      Gameboard.findByIdAndRemove = jest.fn().mockResolvedValue({});

      await deleteGameboard(req as RequestWithPayload, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the send method", async () => {
      const gameboard = {
        gameboard: "gameboard!",
      };

      Gameboard.findByIdAndRemove = jest.fn().mockResolvedValue(gameboard);

      await deleteGameboard(req as RequestWithPayload, res as Response, next);

      expect(res.send).toHaveBeenCalled();
    });
  });
});
