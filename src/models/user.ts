import { Schema, model } from "mongoose";
import { IUser } from "../interface/auth";

const userSchema = new Schema<IUser>({
  username: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  role: {
    required: true,
    type: [Number],
    default: [2, 3],
  },
  active: {
    required: true,
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    unique: true,
  },
  resetToken: {
    type: String,
    unique: true,
  },
  lastRequest: {
    type: Number,
  },
});

const UserModel = model("User", userSchema);

export default UserModel;
