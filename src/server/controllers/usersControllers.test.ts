import { Response } from "express";
import User from "../../database/models/User";
import {
  CustomRequest,
  UserRegister,
  UserRequest,
} from "../../types/interfaces";
import { registerUser } from "./usersControllers";

afterEach(() => {
  jest.clearAllMocks();
});

let mockGetEncriptedData: Promise<string> | string;

jest.mock("../../utils/authentication", () => ({
  ...jest.requireActual("../../utils/authentication"),
  getEncriptedData: () => mockGetEncriptedData,
}));

describe("Given a registerUser middleware", () => {
  describe("When it recives a response with a user", () => {
    describe("And User.findOne() don't return an user and getEncriptedData returns 'hashed'", () => {
      test("Then it should call User.create with the user data, but 'hashed' as password", async () => {
        const user = {
          name: "name",
          email: "email",
          password: "password",
        };
        const hashedUser = {
          ...user,
          password: "hashed",
        };
        const req = {
          body: {
            user,
          },
        } as CustomRequest<UserRequest<UserRegister>>;
        const res = {} as Response;
        const next = () => {};

        mockGetEncriptedData = hashedUser.password;

        User.findOne = jest.fn().mockReturnValue(null);
        User.create = jest.fn();

        await registerUser(req, res, next);

        expect(User.create).toHaveBeenCalledWith(hashedUser);
      });
    });
  });

  describe("When it recives a response and a next function", () => {
    const req = {
      body: {
        user: {},
      },
    } as CustomRequest<UserRequest<UserRegister>>;
    const res = {} as Response;
    const next = jest.fn();

    describe("And User.findOne() returns an user", () => {
      test("Then it should call next function with a custom error", async () => {
        const expectedStatus = 400;
        const expectedPublicMessage = "A user with this email already exists";

        User.findOne = jest.fn().mockReturnValue("something");

        await registerUser(req, res, next);

        const nextParameter = next.mock.calls[0][0];

        expect(nextParameter.publicMessage).toBe(expectedPublicMessage);
        expect(nextParameter.status).toBe(expectedStatus);
      });
    });

    describe("And getEncriptedData throws an error", () => {
      test("Then it should call next function with an error", async () => {
        const error = new Error();

        mockGetEncriptedData = Promise.reject(error);

        User.findOne = jest.fn().mockReturnValue(null);

        await registerUser(req, res, next);

        await expect(next).toHaveBeenCalledWith(error);
      });
    });

    describe("And User.create() throws an error", () => {
      test("Then it should call the next function with an error", async () => {
        const error = new Error();

        User.findOne = jest.fn().mockReturnValue(null);
        User.create = jest.fn().mockRejectedValue(error);

        await registerUser(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });
});
