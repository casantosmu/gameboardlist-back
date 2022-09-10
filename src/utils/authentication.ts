import jws from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserPayload } from "../types/user";

export const getToken = (payload: UserPayload) =>
  jws.sign(payload, process.env.SECRET);

export const verifyToken = (token: string) =>
  jws.verify(token, process.env.SECRET);

export const getEncriptedData = (text: string, salt: number = 10) =>
  bcrypt.hash(text, salt);

export const isEqualEncripted = (text: string, encryptedText: string) =>
  bcrypt.compare(text, encryptedText);
