import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "..";
import connectDB from "../../database";
import User from "../../database/models/User";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUrl = mongoServer.getUri();

  await connectDB(mongoUrl);
});

afterAll(async () => {
  await mongoose.connection.close();

  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a /users/register route", () => {
  describe("When requested with a post method and valid data", () => {
    describe("And User.finOne() not returns an user", () => {
      test("Then it should respond with a status of 200", async () => {
        const expectedStatus = 201;

        const res = await request(app)
          .post("/users/register")
          .send({
            user: {
              name: "name",
              password: "password",
              email: "email",
            },
          });

        expect(res.statusCode).toBe(expectedStatus);
      });

      test("Then it should respond with a body with succes message", async () => {
        const expectedBody = { sucess: "User has been registered" };

        const res = await request(app)
          .post("/users/register")
          .send({
            user: {
              name: "name",
              password: "password",
              email: "email",
            },
          });

        expect(res.body).toStrictEqual(expectedBody);
      });
    });

    describe("And User.finOne() returns a previously registered user", () => {
      test("Then it should respond with a status of 200", async () => {
        const expectedStatus = 400;

        await request(app)
          .post("/users/register")
          .send({
            user: {
              name: "name",
              password: "password",
              email: "email",
            },
          });

        const res = await request(app)
          .post("/users/register")
          .send({
            user: {
              name: "name",
              password: "password",
              email: "email",
            },
          });

        expect(res.statusCode).toBe(expectedStatus);
      });

      test("Then it should respond with a body with error message", async () => {
        const expectedBody = {
          error: "A user with this email already exists",
        };

        await request(app)
          .post("/users/register")
          .send({
            user: {
              name: "name",
              password: "password",
              email: "email",
            },
          });

        const res = await request(app)
          .post("/users/register")
          .send({
            user: {
              name: "name",
              password: "password",
              email: "email",
            },
          });

        expect(res.body).toStrictEqual(expectedBody);
      });
    });
  });

  describe("When requested with a post method and invalid data", () => {
    test("Then it should respond with a status of 400", async () => {
      const expectedStatus = 400;

      const res = await request(app)
        .post("/users/register")
        .send({
          user: {
            name: "",
            password: "",
            email: "",
          },
        });

      expect(res.statusCode).toBe(expectedStatus);
    });

    test("Then it should respond with a body with error message", async () => {
      const expectedBody = { error: "Invalid data" };

      const res = await request(app)
        .post("/users/register")
        .send({
          user: {
            name: "",
            password: "",
            email: "",
          },
        });

      expect(res.body).toStrictEqual(expectedBody);
    });
  });
});
