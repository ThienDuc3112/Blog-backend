import { Request, Response } from "express";
import UserModel from "../../../models/user";
import { genSalt, hash } from "bcrypt";

export const postResetPassword = async (req: Request, res: Response) => {
  const password = req.body.password;
  if (!password || password != req.body.secondEntry) {
    return res
      .status(400)
      .json({ success: false, message: "Password inconsistency" });
  }
  const token = req.params.token;
  const user = await UserModel.findOne({ resetToken: token, active: true });
  if (!user) {
    return res.status(404).json({ success: false, message: "Invalid token" });
  }
  if (Date.now() - user.lastRequest > 1000 * 3600) {
    user
      .updateOne({
        resetToken: (
          Date.now() * 100000 +
          Math.round(Math.random() * 10000)
        ).toString(36),
      })
      .then(() => {
        return res.status(401).json({
          success: false,
          message: "No password reset attempt were made in the last hour",
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Cannot update the user in the database",
        });
      });
    return;
  }
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);
  user
    .updateOne({
      password: hashedPassword,
      resetToken: (
        Date.now() * 100000 +
        Math.round(Math.random() * 10000)
      ).toString(36),
    })
    .then(() => {
      return res.status(200).json({ success: true });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Cannot update the user in the database",
      });
    });
};
