import mongoose from "mongoose";

const gameboardSchema = new mongoose.Schema({
  image: {
    type: String,
    default: "/uploads/example.jpeg",
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 100,
  },
  year: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    enum: ["party", "family", "thematic", "wargame", "strategy"],
    required: true,
  },
  players: {
    min: { type: Number, min: 1, max: 50 },
    max: { type: Number, min: 1, max: 50 },
  },
  time: {
    min: { type: Number, min: 1, max: 1200 },
    max: { type: Number, min: 1, max: 1200 },
  },
  authorship: {
    type: String,
    trim: true,
    required: true,
    maxlength: 100,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Gameboard = mongoose.model("Gameboard", gameboardSchema, "gameboards");

export default Gameboard;
