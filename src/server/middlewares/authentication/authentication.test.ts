import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Error } from "mongoose";
import authentication from "./authentication";

interface CustomRequest extends Request {
  payload: JwtPayload;
}

let mockVerifyToken: (token: string) => string | JwtPayload;
jest.mock("../../../utils/authentication", () => ({
  ...jest.requireActual("../../../utils/authentication"),
  verifyToken: (token: string) => mockVerifyToken(token),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given a authentication function", () => {
  const expectedStatus = 401;
  const expectedCustomErrorMessage = "Invalid authentication";

  describe("When it recive a req", () => {
    test("Then it should call the method get from req with 'Authorization'", () => {
      const req = {
        get: jest.fn(),
      } as Partial<CustomRequest>;
      const res = {} as Partial<Response>;
      const next = () => {};

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(req.get).toHaveBeenCalledWith("Authorization");
    });
  });

  describe("When it recive a req without authorization and a next", () => {
    test("Then it should call the next function with a custom error", () => {
      const req = {
        get: jest.fn().mockReturnValue(null),
      } as Partial<CustomRequest>;
      const res = {} as Partial<Response>;
      const next = jest.fn();

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      const nextParameter = next.mock.calls[0][0];

      expect(nextParameter.status).toBe(expectedStatus);
      expect(nextParameter.privateMessage).toBe(expectedCustomErrorMessage);
      expect(nextParameter.publicMessage).toBe(expectedCustomErrorMessage);
    });
  });

  describe("When it recive a req with a 'asdfs' authorization and a next", () => {
    test("Then it should call the next function with a custom error", () => {
      const req = {
        get: jest.fn().mockReturnValue("asdfasdfa"),
      } as Partial<CustomRequest>;
      const res = {} as Partial<Response>;
      const next = jest.fn();

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      const nextParameter = next.mock.calls[0][0];

      expect(nextParameter.status).toBe(expectedStatus);
      expect(nextParameter.privateMessage).toBe(expectedCustomErrorMessage);
      expect(nextParameter.publicMessage).toBe(expectedCustomErrorMessage);
    });
  });

  describe("When it recive a req with a 'Bearer 123' authorization and a next", () => {
    test("Then it should call verifyToken function with '123'", () => {
      const req = {
        get: jest.fn().mockReturnValue("Bearer 123"),
      } as Partial<CustomRequest>;
      const res = {} as Partial<Response>;
      const next = jest.fn();

      mockVerifyToken = jest.fn();

      const expectedToken = "123";

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(mockVerifyToken).toHaveBeenCalledWith(expectedToken);
    });

    test("Then it should add payload to req with the payload returned by verifyToken", () => {
      const req = {
        get: jest.fn().mockReturnValue("Bearer 123"),
      } as Partial<CustomRequest>;
      const res = {} as Partial<Response>;
      const next = jest.fn();

      const payload = {
        shomething: "blabla",
      };

      mockVerifyToken = jest.fn().mockReturnValue(payload);

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(req.payload).toBe(payload);
    });

    test("Then it should add payload to req with the payload returned by verifyToken", () => {
      const req = {
        get: jest.fn().mockReturnValue("Bearer 123"),
      } as Partial<CustomRequest>;
      const res = {} as Partial<Response>;
      const next = jest.fn();

      const payload = {
        shomething: "blabla",
      };

      mockVerifyToken = jest.fn().mockReturnValue(payload);

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });

    describe("When verifyToken rejects with an error", () => {
      test("Then it should call next with a custom error, with the error message", async () => {
        const req = {
          get: jest.fn().mockReturnValue("Bearer 123"),
        } as Partial<CustomRequest>;
        const res = {} as Partial<Response>;
        const next = jest.fn();

        const privateErrorMessage = "private";

        mockVerifyToken = () => {
          throw new Error(privateErrorMessage);
        };

        authentication(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        const nextParameter = next.mock.calls[0][0];

        expect(nextParameter.status).toBe(expectedStatus);
        expect(nextParameter.privateMessage).toBe(privateErrorMessage);
        expect(nextParameter.publicMessage).toBe(expectedCustomErrorMessage);
      });
    });
  });
});
