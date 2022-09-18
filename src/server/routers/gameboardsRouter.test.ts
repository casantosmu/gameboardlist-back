import "../../test-utils/supertestSetup";
import fs from "fs/promises";
import request from "supertest";
import { HydratedDocument } from "mongoose";
import app from "..";
import { fakeGameboard, fakeUser } from "../../test-utils/fakeData";
import { User as IUser, UserPayload } from "../../types/user";
import { getToken } from "../../utils/authentication";
import "../../loadEnvironment";
import User from "../../database/models/User";
import Gameboard from "../../database/models/Gameboard";

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: jest.fn().mockReturnValue({
          error: false,
        }),
        getPublicUrl: () => ({
          publicURL: "Image url",
        }),
      }),
    },
  }),
}));

let authToken: string;
let newUser: HydratedDocument<IUser>;

beforeAll(async () => {
  newUser = await User.create(fakeUser);

  const mockPayload: UserPayload = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };

  authToken = await getToken(mockPayload);
});

describe("Given the gameRouter", () => {
  describe("When use the endpoint POST /games/create", () => {
    describe("And it receives a correct request with a valid token and gameboard", () => {
      test("Then it should response with a 201 status code", async () => {
        await request(app)
          .post("/gameboards")
          .set("Authorization", `Bearer ${authToken}`)
          .field("rating", fakeGameboard.rating)
          .field("name", fakeGameboard.name)
          .field("year", fakeGameboard.year)
          .field("category", fakeGameboard.category)
          .field("weight", fakeGameboard.weight)
          .field("players[min]", fakeGameboard.players.min)
          .field("players[max]", fakeGameboard.players.max)
          .field("time[min]", fakeGameboard.time.min)
          .field("time[max]", fakeGameboard.time.max)
          .field("authorship", fakeGameboard.authorship || "-")
          .attach("image", "./src/test-utils/images.jpg")
          .expect(201);

        const queryObject = {
          createdBy: newUser.id,
        };

        const gameboard = await Gameboard.findOne(queryObject);

        if (gameboard) {
          await fs.unlink(gameboard.image);
        }
      });

      describe("And it receives a correct request a text document", () => {
        test("Then it should response with a 422", async () => {
          await request(app)
            .post("/gameboards")
            .set("Authorization", `Bearer ${authToken}`)
            .field("rating", fakeGameboard.rating)
            .field("name", fakeGameboard.name)
            .field("year", fakeGameboard.year)
            .field("category", fakeGameboard.category)
            .field("weight", fakeGameboard.weight)
            .field("players[min]", fakeGameboard.players.min)
            .field("players[max]", fakeGameboard.players.max)
            .field("time[min]", fakeGameboard.time.min)
            .field("time[max]", fakeGameboard.time.max)
            .field("authorship", fakeGameboard.authorship || "-")
            .attach("image", Buffer.from("rga", "utf-8"), {
              filename: "erg",
            })
            .expect(422);

          const queryObject = {
            createdBy: newUser.id,
          };

          const gameboard = await Gameboard.findOne(queryObject);

          if (gameboard?.image) {
            await fs.unlink(gameboard.image);
          }
        });
      });
    });
  });
});
