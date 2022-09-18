import { model, Schema } from "mongoose";
import { User as IUser } from "../../types/user";

const userSchema = new Schema<IUser>({
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

const User = model<IUser>("User", userSchema, "users");

export default User;
