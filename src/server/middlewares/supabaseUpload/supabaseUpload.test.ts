import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import supabaseUpload from "./supabaseUpload";

let mockUpload = jest.fn().mockReturnValue({
  error: false,
});

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: () => ({
          publicURL: "Image url",
        }),
      }),
    },
  }),
}));

beforeAll(async () => {
  await fs.writeFile("uploads/filename", "content");
});

afterAll(async () => {
  await fs.unlink("uploads/filename");
});

beforeEach(async () => {
  await jest.clearAllMocks();
});

describe("Given a supabaseUpload function", () => {
  const req = {
    body: {
      logo: "logo-name.png",
    },
    file: {
      path: "uploads/filename",
      filename: "filename",
    },
  } as Partial<Request>;
  const res = {} as Response;
  const next = jest.fn();

  describe("When called with a request, a response and a next function as arguments", () => {
    test("Then it should call next", async () => {
      await supabaseUpload(req as Request, res, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });

    test("Then it should upload a file to supabase", async () => {
      await supabaseUpload(
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

      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(true);
    });

    test("Then it should set the image url at the body request", async () => {
      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(req.body.fileBackup).toBe("Image url");
    });

    test("If an error occurs during the process, it should call next with an error", async () => {
      const expectedErrorMessage = "Error message";
      const error = new Error(expectedErrorMessage);

      mockUpload = jest.fn().mockRejectedValue(error);

      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      const nextCalled = next.mock.calls[0][0];
      expect(nextCalled.message).toBe(expectedErrorMessage);
    });
  });

  // describe("When called with a request that doesn't have a logo", () => {
  //   test("Then it should call next and not upload anything if the logo is empty", async () => {
  //     const reqWithoutLogo = {
  //       body: {
  //         logo: "",
  //       },
  //     } as Partial<Request>;

  //     await supabaseUpload(
  //       reqWithoutLogo as Request,
  //       res as Response,
  //       next as NextFunction
  //     );

  //     expect(next).toHaveBeenCalled();
  //     expect(mockUpload).not.toHaveBeenCalled();
  //   });

  //   test("Then it should call next and not upload anything if the logo is 'default_logo'", async () => {
  //     const reqWithoutLogo = {
  //       body: {
  //         logo: "default_logo",
  //       },
  //     } as Partial<Request>;

  //     await supabaseUpload(
  //       reqWithoutLogo as Request,
  //       res as Response,
  //       next as NextFunction
  //     );

  //     expect(next).toHaveBeenCalled();
  //     expect(mockUpload).not.toHaveBeenCalled();
  //   });
  // });
});
