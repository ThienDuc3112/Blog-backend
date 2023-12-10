import { Request, Response } from "express";
import { transporter } from "../../..";
import { genSalt, hash } from "bcrypt";
import UserModel from "../../../models/user";

export const postRegister = async (req: Request, res: Response) => {
  let {
    username,
    password,
    email,
  }: { username: string; password: string; email: string } = req.body;
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Incomplete user data" });
  }
  username = username.trim().toLowerCase();
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  const user = new UserModel({
    username,
    email,
    password: hashedPassword,
    role: [2, 3],
    active: false,
    verifyToken: (
      Date.now() * 100000 +
      Math.round(Math.random() * 10000)
    ).toString(36),
    resetToken: (
      Date.now() * 100000 +
      Math.round(Math.random() * 10000)
    ).toString(36),
    lastRequest: 0,
  });

  user
    .save()
    .then(() => {
      transporter.sendMail(
        {
          from: process.env.EMAIL,
          to: user.email,
          subject: "Duc's blog email verification",
          text: `Click on this link to verify your email: ${process.env.BASE_URL}/verify/${user.verifyToken}`,
        },
        (err, info) => {
          if (!err) return res.status(201).json({ success: true });
          user.deleteOne({ _id: user._id }).finally(() => {
            return res.status(500).json({
              success: false,
              message: "Server cannot verify email right now",
            });
          });
        }
      );
    })
    .catch((err) => {
      if (err.name == "MongoServerError" && err.code == 11000) {
        const retVal = {
          success: false,
          message: "Duplicate field",
          field: null as null | string[],
        };
        if (err.keyPattern) {
          retVal.field = Object.keys(err.keyPattern);
        }
        return res.status(409).json(retVal);
      }
      res.status(500).json({ success: false, message: err.message });
    });
};
