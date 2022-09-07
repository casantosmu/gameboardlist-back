import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  gameboards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Gameboard",
    },
  ],
});

const User = mongoose.model("User", userSchema, "users");

export default User;
