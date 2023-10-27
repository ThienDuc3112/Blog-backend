import { Schema, model } from "mongoose";

interface IUser {
  username: string;
  password: string;
  email: string;
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
});

const UserModel = model("User", userSchema);

export default UserModel;
