import { NextFunction, Response } from "express";
import { IAuthRequest } from "../../../interface/auth";
import { verify } from "jsonwebtoken";

export const MWgetUser = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;
  if (!token) {
    next();
    return;
  }
  verify(token, process.env.AUTH_TOKEN as string, (err: any, user: any) => {
    if (!err) req.user = user;
    next();
  });
};
