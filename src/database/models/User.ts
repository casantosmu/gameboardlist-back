import { model, Schema } from "mongoose";

const userSchema = new Schema({
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
    minlength: 3,
    maxlength: 50,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

const User = model("User", userSchema, "users");

export default User;
