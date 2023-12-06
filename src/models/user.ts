import { Schema, model } from "mongoose";

interface IUser {
  username: string;
  password: string;
  email: string;
  role: number[];
  active: boolean;
  verifyToken?: string;
}

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
});

const UserModel = model("User", userSchema);

export default UserModel;
