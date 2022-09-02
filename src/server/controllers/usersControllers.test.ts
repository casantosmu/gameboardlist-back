import "../../loadEnvironment";
import { Response } from "express";
import User from "../../database/models/User";
import {
  CustomRequest,
  UserLogin,
  UserPayload,
  UserRegister,
  UserRequest,
} from "../../types/interfaces";
import { loginUser, registerUser } from "./usersControllers";

afterEach(() => {
  jest.clearAllMocks();
});

let mockGetEncriptedData: Promise<string> | string;
let mockIsEqualEncripted: boolean;
let mockGetToken: (payload: UserPayload) => string;

jest.mock("../../utils/authentication", () => ({
  ...jest.requireActual("../../utils/authentication"),
  getEncriptedData: () => mockGetEncriptedData,
  isEqualEncripted: () => mockIsEqualEncripted,
  getToken: (payload: UserPayload) => mockGetToken(payload),
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

describe("Given a loginUser middleware", () => {
  const req = {
    body: {
      user: {
        email: "",
        password: "",
      },
    },
  } as CustomRequest<UserRequest<UserLogin>>;
  const next = jest.fn();

  describe("When it recives a response function", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    describe("And User.findOne returns an user and isEqualEncripted returns true", () => {
      test("Then it should call getToken with the found user id, name and email", async () => {
        const user: UserPayload = {
          id: "id",
          email: "email",
          name: "name",
        };

        User.findOne = jest.fn().mockResolvedValue(user);
        mockIsEqualEncripted = true;
        mockGetToken = jest.fn();

        await loginUser(req, res as Response, next);

        expect(mockGetToken).toHaveBeenCalledWith(user);
      });

      describe("And getToken returns 'token'", () => {
        test("Then it should call the respose status method with a 200", async () => {
          const expectedStatus = 200;

          User.findOne = jest.fn().mockResolvedValue("some");
          mockIsEqualEncripted = true;

          await loginUser(req, res as Response, next);

          expect(res.status).toHaveBeenCalledWith(expectedStatus);
        });

        test("Then it should call the respose json method with 'token'", async () => {
          const token = "token";
          const expetedJson = {
            user: {
              token,
            },
          };

          User.findOne = jest.fn().mockResolvedValue("some");
          mockIsEqualEncripted = true;
          mockGetToken = jest.fn().mockReturnValue(token);

          await loginUser(req, res as Response, next);

          expect(res.json).toHaveBeenCalledWith(expetedJson);
        });
      });
    });
  });

  describe("When it recives a next function and a request", () => {
    const res = {} as Response;

    const expectedCustomErrorMessage = "Username or password not found";

    describe("And User.findOne do not returns an user", () => {
      test("Then it should call the next function with a custom error", async () => {
        User.findOne = jest.fn().mockResolvedValue(null);

        await loginUser(req, res, next);

        const nextParameter = next.mock.calls[0][0];

        expect(nextParameter.status).toBe(400);
        expect(nextParameter.privateMessage).toBe(expectedCustomErrorMessage);
        expect(nextParameter.publicMessage).toBe(expectedCustomErrorMessage);
      });
    });

    describe("And isEqualEncripted returns it's not true", () => {
      test("Then it should call the next function with a custom error", async () => {
        User.findOne = jest.fn().mockResolvedValue("some");
        mockIsEqualEncripted = false;

        await loginUser(req, res, next);

        const nextParameter = next.mock.calls[0][0];

        expect(nextParameter.status).toBe(400);
        expect(nextParameter.privateMessage).toBe(expectedCustomErrorMessage);
        expect(nextParameter.publicMessage).toBe(expectedCustomErrorMessage);
      });
    });
  });
});
