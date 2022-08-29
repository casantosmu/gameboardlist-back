import mongoose from "mongoose";
import { getEncriptedData } from "../../utils/authentication";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

// eslint-disable-next-line func-names
userSchema.pre("save", async function (next) {
  try {
    this.password = await getEncriptedData(this.password);

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema, "users");

export default User;
