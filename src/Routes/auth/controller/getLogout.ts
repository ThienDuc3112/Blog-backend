import { Request, Response } from "express";
import { config } from "dotenv";
config();
const option =
  process.env.PRODUCTION == "FALSE"
    ? {}
    : {
        sameSite: "lax",
        secure: true,
      };

export const getLogout = (req: Request, res: Response) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      maxAge: 0,
      ...(option as any),
    })
    .status(200)
    .json({ success: true });
};
