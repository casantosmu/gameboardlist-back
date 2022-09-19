import { Request, Response } from "express";
import validateObjectId from "./validateObjectId";

afterEach(() => {
  jest.clearAllMocks();
});

let mockIsValidObjectId: (id: string) => boolean;
jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  isValidObjectId: (id: string) => mockIsValidObjectId(id),
}));

describe("Given a validateObjectId middleware", () => {
  describe("When its invoked with a next function and a request with id on params", () => {
    const req = {
      params: {
        id: "id",
      },
    } as Partial<Request>;
    const res = {} as Response;
    const next = jest.fn();

    describe("And isValidObjectId returns true", () => {
      test("Then it should call next function", async () => {
        mockIsValidObjectId = jest.fn().mockReturnValue(true);
        await validateObjectId(req as Request, res, next);

        expect(next).toBeCalledWith();
      });
    });

    describe("And isValidObjectId returns false", () => {
      test("Then it should call next function with a custom error", async () => {
        const expectedPublicMessage = "Invalid ID field in params";
        const expectedStatus = 400;

        mockIsValidObjectId = jest.fn().mockReturnValue(false);
        await validateObjectId(req as Request, res, next);

        const nextParameter = next.mock.calls[0][0];

        expect(nextParameter.publicMessage).toBe(expectedPublicMessage);
        expect(nextParameter.status).toBe(expectedStatus);
      });
    });
  });
});
