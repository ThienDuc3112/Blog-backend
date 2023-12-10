import { Response } from "express";
import { IAuthRequest } from "../../../interface/auth";

export const getAuthenticate = (req: IAuthRequest, res: Response) => {
  res.status(200).json({ success: true, data: req.user });
};
