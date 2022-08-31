import { Response } from "express";
import User from "../../database/models/User";
import { CustomRequest, UserRegister } from "../../types/interfaces";
import registerUser from "./usersControllers";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given a registerUser middleware", () => {
  describe("When it recives a response and next function", () => {
    const req = {
      body: {
        user: {
          email: "some@email.com",
        },
      },
    } as CustomRequest<UserRegister>;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn();

    describe("And User.findOne() returns an user", () => {
      test("Then it should call next function with a custom error", async () => {
        User.findOne = jest.fn().mockReturnValue("something");

        const expectedError = {
          status: 400,
          publicMessage: "A user with this this email already exists",
        };

        await registerUser(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(
          expect.objectContaining(expectedError)
        );
      });
    });

    describe("And User.create() returns a user", () => {
      test("Then it should call the response method with a status 201", async () => {
        const expectedStatus = 201;

        User.findOne = jest.fn().mockReturnValue(null);
        User.create = jest.fn().mockReturnValue({});

        await registerUser(
          req as CustomRequest<UserRegister>,
          res as Response,
          next
        );

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });

      test("Then it should call the json method with a success message", async () => {
        const expectedMessage = { sucess: "User has been registered" };

        User.findOne = jest.fn().mockReturnValue(null);
        User.create = jest.fn().mockReturnValue({});

        await registerUser(
          req as CustomRequest<UserRegister>,
          res as Response,
          next
        );

        expect(res.json).toHaveBeenCalledWith(expectedMessage);
      });
    });

    describe("And User.create() throws an error", () => {
      test("Then it should call the next function with an error", async () => {
        const error = new Error();

        User.findOne = jest.fn().mockReturnValue(null);
        User.create = jest.fn().mockRejectedValue(error);

        await registerUser(
          req as CustomRequest<UserRegister>,
          res as Response,
          next
        );

        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });
});
