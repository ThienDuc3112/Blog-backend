import { Request, Response } from "express";
import UserModel from "../../../models/user";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "dotenv";
config();

export const postLogin = async (req: Request, res: Response) => {
  if (!req.body.password)
    return res
      .status(400)
      .json({ success: false, message: "Please provide a password" });

  const username = req.body.username;
  const user = await UserModel.findOne({
    $or: [{ username }, { email: username }],
    active: true,
  });

  if (user == null)
    return res.status(404).json({ success: false, message: "User not found" });

  if (!(await compare(req.body.password, user.password)))
    return res
      .status(401)
      .json({ success: false, message: "Invalid password" });

  const accessToken = sign(
    { username: user.username, role: user.role },
    process.env.AUTH_TOKEN as string,
    { expiresIn: "6h" }
  );

  res.status(200).json({ success: true, role: user.role, token: accessToken });
};
