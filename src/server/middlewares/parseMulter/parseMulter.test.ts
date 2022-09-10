import { Request, Response } from "express";
import parseMulter from "./parseMulter";

beforeEach(async () => {
  await jest.clearAllMocks();
});

describe("Given a parseMulter middleware", () => {
  describe("When it recive a request with a file and a next function", () => {
    const req = {
      file: {
        path: "token",
      },
      body: {},
    } as Partial<Request>;
    const res = {} as Partial<Response>;
    const next = jest.fn();

    test("Then it should add the file on request body", async () => {
      const expectedFile = req.file.path;

      await parseMulter(req as Request, res as Response, next);

      expect(req.body.file).toBe(expectedFile);
    });

    test("Then it should call next function", async () => {
      await parseMulter(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it recive a request without a file and a next function", () => {
    const req = {
      body: {},
    } as Partial<Request>;
    const res = {} as Partial<Response>;
    const next = jest.fn();

    test("Then it should call next function with a custom error", async () => {
      const expectedStatus = 400;
      const expectedPublicMessage = "You must add a file to the request";

      await parseMulter(req as Request, res as Response, next);
      const nextParameter = next.mock.calls[0][0];

      expect(nextParameter.publicMessage).toBe(expectedPublicMessage);
      expect(nextParameter.status).toBe(expectedStatus);
    });
  });
});
