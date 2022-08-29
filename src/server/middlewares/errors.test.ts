import { Request, Response } from "express";
import CustomError from "../../utils/CustomError";
import { generalError, notFoundError } from "./errors";

describe("Given a notFoundError middleware", () => {
  describe("When receives a response object", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    test("Then it should call the response status method with 404", () => {
      const status = 404;

      notFoundError(req, res as Response);

      expect(res.status).toHaveBeenCalledWith(status);
    });

    test("Then it should call the response json method with the message 'Endpoint not found'", () => {
      const testError = { error: "Endpoint not found" };

      notFoundError(req, res as Response);

      expect(res.json).toHaveBeenCalledWith(testError);
    });
  });
});

describe("Given a generalError middleware", () => {
  const req = {} as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const next = () => {};

  describe("When it receives an error with status 403", () => {
    describe("Then it should call the response status method with the received status", () => {
      const expectedStatus = 403;

      const error = new CustomError(expectedStatus, "");

      generalError(error, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    describe("When it receives an error with 'Public' as public message", () => {
      test("Then it should call the response json method with the received message", () => {
        const publicMessage = "Public";
        const expectedError = {
          error: publicMessage,
        };

        const error = new CustomError(0, publicMessage);

        generalError(error, req, res as Response, next);

        expect(res.json).toHaveBeenCalledWith(expectedError);
      });
    });

    describe("When it receives an error", () => {
      describe("Then it should call the response status method with 500 status", () => {
        const expectedStatus = 500;

        const error = new Error();

        generalError(error as CustomError, req, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });
    });

    test("Then it should call the response json method with the 'General error' message", () => {
      const expectedError = {
        error: "Internal server error",
      };

      const error = new Error();

      generalError(error as CustomError, req, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});
