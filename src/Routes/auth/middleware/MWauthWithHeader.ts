import { NextFunction, Response } from "express";
import { IAuthRequest } from "../../../interface/auth";
import { verify } from "jsonwebtoken";

export const MWauthHeader = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "You are not logged in" });
  verify(token, process.env.AUTH_TOKEN as string, (err: any, user: any) => {
    if (err)
      return res.status(403).json({ success: false, message: "Invalid token" });
    req.user = user;
    next();
  });
};
