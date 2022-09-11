import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import supabaseImage from "./supabaseImage";

const url = "uploads/image.png";
const req = {
  body: {
    image: url,
  },
} as Partial<Request>;
const res = {} as Partial<Response>;
const next = jest.fn();

let mockUpload = jest.fn().mockReturnValue({
  error: null,
});

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: () => ({
          publicURL: url,
        }),
      }),
    },
  }),
}));

beforeEach(() => jest.clearAllMocks());
beforeAll(async () => {
  await fs.writeFile(req.body.image, "content");
});

afterAll(async () => {
  await fs.unlink(req.body.image);
});

describe("Given a supabaseImage function", () => {
  describe("When called with a request, a response and a next function as arguments", () => {
    test("Then it should call next", async () => {
      await supabaseImage(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });

    test("Then it should upload a file to supabase", async () => {
      await supabaseImage(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(mockUpload).toHaveBeenCalled();
    });

    test("If the upload fails, it should call next with an error", async () => {
      mockUpload = jest.fn().mockReturnValue({
        error: true,
      });

      await supabaseImage(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(true);
    });

    test("Then it should set the image url at the body request", async () => {
      await supabaseImage(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(req.body.imageBackup).toBe(url);
    });

    test("If an error occurs during the process, it should call next with an error", async () => {
      const expectedErrorMessage = "Error message";
      const error = new Error(expectedErrorMessage);

      mockUpload = jest.fn().mockRejectedValue(error);

      await supabaseImage(
        req as Request,
        res as Response,
        next as NextFunction
      );

      const nextCalled = next.mock.calls[0][0];
      expect(nextCalled.message).toBe(expectedErrorMessage);
    });
  });
});
