import { Request, Response } from "express";
import checkRequestFile from "./checkRequestFile";

beforeEach(async () => {
  await jest.clearAllMocks();
});

describe("Given a checkRequestFile middleware", () => {
  describe("When it recive a request with a file and a next function", () => {
    const req = {
      file: {},
      body: {},
    } as Partial<Request>;
    const res = {} as Response;
    const next = jest.fn();

    test("Then it should call next function", async () => {
      await checkRequestFile(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it recive a request without a file and a next function", () => {
    const req = {
      body: {},
    } as Partial<Request>;
    const res = {} as Response;
    const next = jest.fn();

    test("Then it should call next function with a custom error", async () => {
      const expectedStatus = 400;
      const expectedPublicMessage = "You must add a file to the request";

      await checkRequestFile(req as Request, res, next);
      const nextParameter = next.mock.calls[0][0];

      expect(nextParameter.publicMessage).toBe(expectedPublicMessage);
      expect(nextParameter.status).toBe(expectedStatus);
    });
  });
});
