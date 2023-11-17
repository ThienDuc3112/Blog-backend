import { Schema, model } from "mongoose";

interface IUser {
  username: string;
  password: string;
  email: string;
  role: number[];
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
    unique: true,
  },
  role: {
    type: [Number],
    default: [2, 3],
  },
});

const UserModel = model("User", userSchema);

export default UserModel;
