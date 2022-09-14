import { Request, Response } from "express";
import resizeImage from "./resizeImage";

jest.mock("sharp", () => ({
  resize: jest.fn().mockRejectedValue(new Error()),
}));

describe("Given a resizeImage middleware", () => {
  describe("When its invoked with a next function And sharp rejects with and error", () => {
    test("Then it should call the next function with a custom error", async () => {
      const req = {
        file: {
          buffer: "045045",
          originalname: "name",
        },
      } as unknown as Partial<Request>;
      const res = {} as Partial<Response>;
      const next = jest.fn();

      await resizeImage(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(new Error());
    });
  });
});
