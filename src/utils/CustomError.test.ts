import CustomError from "./CustomError";

describe("Given a CustomError class", () => {
  describe("When its instantiated", () => {
    test("Then it should be an Error", () => {
      const error = new Error();

      const customError = new CustomError(0, "");

      expect(customError).toEqual(error);
    });
  });

  describe("When its instantiated with status 200", () => {
    test("Then it should have the property status with a 200 code", () => {
      const expectedStatus = 200;

      const customError = new CustomError(expectedStatus, "");

      expect(customError.status).toBe(expectedStatus);
    });
  });

  describe("When its instantiated with 'Public' as public message", () => {
    test("Then it should have the public and private message property with 'Public'", () => {
      const expectedMessage = "Public";

      const customError = new CustomError(0, expectedMessage);

      expect(customError.publicMessage).toBe(expectedMessage);
      expect(customError.privateMessage).toBe(expectedMessage);
    });
  });

  describe("When its instantiated with 'Private' as private message ", () => {
    test("Then it should have the private message property with 'Private'", () => {
      const expectedPrivateMessage = "Private";

      const customError = new CustomError(0, "", "Private");

      expect(customError.privateMessage).toBe(expectedPrivateMessage);
    });
  });

  describe("When its instantiated with 'Name' as name", () => {
    test("Then it should have the property name with 'Name", () => {
      const expectedName = "Name";

      const customError = new CustomError(0, "", "Private", "Name");

      expect(customError.name).toBe(expectedName);
    });
  });

  describe("When its instantiated without name", () => {
    test("Then it should have the property name with 'Error", () => {
      const expectedName = "Error";

      const customError = new CustomError(0, "");

      expect(customError.name).toBe(expectedName);
    });
  });
});
