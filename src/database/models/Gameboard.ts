import { model, Schema, Types } from "mongoose";

const gameboardSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  imageBackup: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  weight: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
    min: 1,
    maxlength: 100,
  },
  year: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["party", "family", "thematic", "wargame", "strategy"],
    required: true,
  },
  players: {
    min: { type: Number, min: 1, max: 50, required: true },
    max: { type: Number, min: 1, max: 50, required: true },
  },
  time: {
    min: { type: Number, min: 1, max: 1200, required: true },
    max: { type: Number, min: 1, max: 1200, required: true },
  },
  authorship: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Gameboard = model("Gameboard", gameboardSchema, "gameboards");

export default Gameboard;
