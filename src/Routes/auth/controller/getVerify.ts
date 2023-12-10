import { Request, Response } from "express";
import UserModel from "../../../models/user";

export const getVerify = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({
    verifyToken: req.params.token,
    active: false,
  });
  if (!user)
    return res.status(404).json({ success: false, message: "No user found" });
  user
    .updateOne({
      active: true,
    })
    .then(() => {
      return res.status(200).json({ success: true });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ success: false, message: "Cannot update user" });
    });
};
