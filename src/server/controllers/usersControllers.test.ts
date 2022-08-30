import { Response } from "express";
import User from "../../database/models/User";
import { CustomRequest, UserRegister } from "../../types/interfaces";
import CustomError from "../../utils/CustomError";
import registerUser from "./usersControllers";

describe("Given a registerUser middleware", () => {
  describe("When it recives a response and next function", () => {
    describe("And User.findOne() returns an user", () => {
      test("Then it should call next function with a custom error", async () => {
        const req = {
          body: {
            user: {
              email: "some@email.com",
            },
          },
        } as CustomRequest<UserRegister>;
        const res = {} as Partial<Response>;
        const next = jest.fn();

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
  });

  describe("When it recives a response with valid data", () => {
    describe("And User.create() returns a user", () => {
      const req = {
        body: {
          user: {},
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = () => {};

      test("Then it should call the response method with a status 200", async () => {
        const expectedStatus = 200;

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
  });

  describe("When it recives a response with invalid data and a next function", () => {
    describe("And User.create() throws a ValidationError", () => {
      test("Then it should call the next function with a Custom Error", async () => {
        const req = {
          body: {
            user: {},
          },
        } as Partial<CustomRequest<UserRegister>>;
        const res = {};
        const next = jest.fn();

        User.findOne = jest.fn().mockReturnValue(null);
        User.create = jest
          .fn()
          .mockRejectedValue(new CustomError(0, "", "", "ValidationError"));

        const expectedError = {
          publicMessage: "Could not create user due to some invalid fields",
          status: 400,
        };

        await registerUser(
          req as CustomRequest<UserRegister>,
          res as Response,
          next
        );

        expect(next).toHaveBeenCalledWith(
          expect.objectContaining(expectedError)
        );
      });
    });
  });
});
