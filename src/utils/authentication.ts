import bcrypt from "bcrypt";

export const getEncriptedData = (text: string, salt: number = 10) =>
  bcrypt.hash(text, salt);

export const isEqualEncripted = (text: string, encryptedText: string) =>
  bcrypt.compare(text, encryptedText);
