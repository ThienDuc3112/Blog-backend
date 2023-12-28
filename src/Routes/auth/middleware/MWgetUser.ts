import { NextFunction, Response } from "express";
import { IAuthRequest } from "../../../interface/auth";
import { verify } from "jsonwebtoken";

export const MWgetUser = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    next();
    return;
  }
  verify(token, process.env.AUTH_TOKEN as string, (err: any, user: any) => {
    if (!err) req.user = user;
    next();
  });
};
