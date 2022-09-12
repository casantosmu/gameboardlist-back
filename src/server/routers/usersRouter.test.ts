import "../../test-utils/supertestSetup";
import request from "supertest";
import app from "..";

describe("Given a /users/register route", () => {
  describe("When requested with a post method and valid data", () => {
    const validRequest = {
      user: {
        name: "name",
        password: "password",
        email: "email",
      },
    };

    describe("And User.finOne() not returns an user", () => {
      test("Then it should respond with a status of 201", async () => {
        const expectedStatus = 201;

        const res = await request(app)
          .post("/users/register")
          .send(validRequest);

        expect(res.statusCode).toBe(expectedStatus);
      });

      test("Then it should respond with a body with succes message", async () => {
        const expectedBody = { success: "User has been registered" };

        const res = await request(app)
          .post("/users/register")
          .send(validRequest);

        expect(res.body).toStrictEqual(expectedBody);
      });
    });

    describe("And User.finOne() returns a previously registered user", () => {
      test("Then it should respond with a status of 409", async () => {
        const expectedStatus = 409;

        await request(app).post("/users/register").send(validRequest);

        const res = await request(app)
          .post("/users/register")
          .send(validRequest);

        expect(res.statusCode).toBe(expectedStatus);
      });

      test("Then it should respond with a body with error message", async () => {
        const expectedBody = {
          error: "A user with this email already exists",
        };

        await request(app).post("/users/register").send(validRequest);

        const res = await request(app)
          .post("/users/register")
          .send(validRequest);

        expect(res.body).toStrictEqual(expectedBody);
      });
    });
  });

  describe("When requested with a post method and invalid data", () => {
    const invalidRequest = {
      user: {
        name: "",
        password: "",
        email: "",
      },
    };

    test("Then it should respond with a status of 400", async () => {
      const expectedStatus = 400;

      const res = await request(app)
        .post("/users/register")
        .send(invalidRequest);

      expect(res.statusCode).toBe(expectedStatus);
    });

    test("Then it should respond with a body with error message", async () => {
      const expectedBody = { error: "Invalid data" };

      const res = await request(app)
        .post("/users/register")
        .send(invalidRequest);

      expect(res.body).toStrictEqual(expectedBody);
    });
  });
});
