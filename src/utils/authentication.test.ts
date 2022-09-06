import bcrypt from "bcrypt";
import jws from "jsonwebtoken";
import {
  getEncriptedData,
  getToken,
  isEqualEncripted,
  verifyToken,
} from "./authentication";

describe("Given a getEncriptedData function", () => {
  describe("When its invoked", () => {
    test("Then it should return the value returned by invoking bcrypt hash", () => {
      const expectedReturn = "something";

      bcrypt.hash = jest.fn().mockReturnValue(expectedReturn);

      const returnedValue = getEncriptedData("", 0);

      expect(returnedValue).toBe(expectedReturn);
    });
  });

  describe("When its called with 'password' as text and '10' as salt", () => {
    test("Then it should call the bcrypt hash function with the received text and number", () => {
      const text = "password";
      const salt = 10;

      bcrypt.hash = jest.fn();

      getEncriptedData(text);

      expect(bcrypt.hash).toHaveBeenCalledWith(text, salt);
    });
  });
});

describe("Given isEqualEncripted function", () => {
  describe("When invoked", () => {
    test("Then it should return the value returned by invoking bcrypt compare", () => {
      const expectedReturn = "something";

      bcrypt.compare = jest.fn().mockReturnValue(expectedReturn);

      const returnedValue = isEqualEncripted("", "");

      expect(returnedValue).toBe(expectedReturn);
    });
  });

  describe("When its called with 'password' as text and 'encrypt' as encrypted text", () => {
    test("Then it should call the bcrypt compare function with the received texts", () => {
      const text = "password";
      const encrypted = "encrypt";

      bcrypt.compare = jest.fn();

      isEqualEncripted(text, encrypted);

      expect(bcrypt.compare).toHaveBeenCalledWith(text, encrypted);
    });
  });
});

describe("Given getToken function", () => {
  describe("When invoked", () => {
    test("Then it should return the value returned by invoking jws sign", () => {
      const fakePayload = { id: "", email: "", name: "" };
      const expectedReturn = "something";

      jws.sign = jest.fn().mockReturnValue(expectedReturn);

      const returnedValue = getToken(fakePayload);

      expect(returnedValue).toBe(expectedReturn);
    });
  });

  describe("When its called with id, email and name", () => {
    test("Then it should call the jws sign function with the received payload and secret", () => {
      const payload = { id: "id", email: "@", name: "name" };
      const secret = process.env.SECRET;

      jws.sign = jest.fn();

      getToken(payload);

      expect(jws.sign).toHaveBeenCalledWith(payload, secret);
    });
  });
});

describe("Given verifyToken function", () => {
  describe("When invoked", () => {
    test("Then it should return the value returned by invoking jws verify", () => {
      const expectedReturn = true;

      jws.verify = jest.fn().mockReturnValue(expectedReturn);

      const returnedValue = verifyToken("");

      expect(returnedValue).toBe(expectedReturn);
    });
  });

  describe("When its called with a token", () => {
    test("Then it should call the jws verify function with the received token", () => {
      const token = "token";
      const secret = process.env.SECRET;

      jws.verify = jest.fn();

      verifyToken(token);

      expect(jws.verify).toHaveBeenCalledWith(token, secret);
    });
  });
});
