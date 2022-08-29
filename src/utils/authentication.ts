import bcrypt from "bcrypt";

export const getEncriptedData = (text: string, salt: number = 10) =>
  bcrypt.hash(text, salt);

export const isEqualEncripted = (password: string, encryptedPassword: string) =>
  bcrypt.compare(password, encryptedPassword);
