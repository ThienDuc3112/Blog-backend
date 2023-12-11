import { Request, Response } from "express";
import UserModel from "../../../models/user";

export const getVerifyResetToken = async (req: Request, res: Response) => {
  const token = req.params.token;
  const user = await UserModel.findOne({
    resetToken: token,
    active: true,
    lastRequest: {
      $gt: Date.now() - 1000 * 3600,
    },
  });
  if (!user) {
    return res.status(400).json({ success: false, message: "Not valid token" });
  }
  return res.status(200).json({ success: true });
};
