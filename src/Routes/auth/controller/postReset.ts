import { Request, Response } from "express";
import UserModel from "../../../models/user";
import { transporter } from "../../..";

export const postReset = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({ email: req.body.email, active: true });
  if (!user) {
    return res.status(404).json({ success: false, message: "Email not found" });
  }
  if (Date.now() - user.lastRequest < 1000 * 3600 * 24) {
    return res.status(401).json({
      success: false,
      message: "You've already reset in the last 24 hours",
    });
  }
  transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Duc's blog account password reset",
      text: `Click on this link to reset your password: ${process.env.BASE_URL}/resetpassword/${user.resetToken}`,
    },
    (err, info) => {
      if (!err) {
        user
          .updateOne({ lastRequest: Date.now() })
          .finally(() => res.status(204).json());
      }
      res.status(500).json({ success: false, message: "Cannot send email" });
    }
  );
};
