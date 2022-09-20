// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import fs from "fs/promises";
import connectDB from "../../database";
import Gameboard from "../../database/models/Gameboard";
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
  const gameboards = await Gameboard.find({});
  gameboards.forEach(async (gameboard) => fs.unlink(gameboard.image));

  await User.deleteMany();
  await Gameboard.deleteMany();
});
