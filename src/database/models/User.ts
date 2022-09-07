import { model, Schema } from "mongoose";
import { User as IUser } from "../../types/interfaces";

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

const User = model<IUser>("User", userSchema, "users");

export default User;
