import bcrypt from "bcrypt";
import { getEncriptedData, isEqualEncripted } from "./authentication";

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
