import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IAuthRequest } from "../interface/auth";
import { compare, genSalt, hash } from "bcrypt";
import UserModel from "../models/user";
import { config } from "dotenv";
import { transporter } from "..";
import { MongooseError } from "mongoose";
config();
const option =
  process.env.PRODUCTION == "FALSE"
    ? {}
    : {
        sameSite: "none",
        secure: true,
      };

export const authMW = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "You are not logged in" });
  jwt.verify(token, process.env.AUTH_TOKEN as string, (err: any, user: any) => {
    if (err)
      return res.status(403).json({ success: false, message: "Invalid token" });
    req.user = user;
    next();
  });
};

export const getUser = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;
  if (!token) {
    next();
    return;
  }
  jwt.verify(token, process.env.AUTH_TOKEN as string, (err: any, user: any) => {
    if (!err) req.user = user;
    next();
  });
};

export const authenticate = (req: IAuthRequest, res: Response) => {
  res.status(200).json({ success: true, data: req.user });
};

export const register = async (req: Request, res: Response) => {
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
      Date.now() * 10000 +
      Math.round(Math.random() * 1000)
    ).toString(36),
  });

  user
    .save()
    .then(() => {
      transporter.sendMail(
        {
          from: process.env.EMAIL,
          to: user.email,
          subject: "Duc's blog email verification",
          text: `Click on this link to verify your email: ${
            process.env.PRODUCTION == "FALSE"
              ? `http://localhost:3000`
              : `${process.env.BASE_URL}`
          }/verify/${user.verifyToken}`,
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

export const login = async (req: Request, res: Response) => {
  if (!req.body.password)
    return res
      .status(400)
      .json({ success: false, message: "Please provide a password" });

  const username = req.body.username;
  const user = await UserModel.findOne({ username, active: true });

  if (user == null)
    return res.status(404).json({ success: false, message: "User not found" });

  if (!(await compare(req.body.password, user.password)))
    return res
      .status(401)
      .json({ success: false, message: "Invalid password" });

  const accessToken = jwt.sign(
    { username: user.username, role: user.role },
    process.env.AUTH_TOKEN as string,
    { expiresIn: "6h" }
  );

  res
    .status(200)
    .cookie("token", accessToken, {
      // maxAge: 15 * 60 * 1000,
      maxAge: 6 * 3600 * 1000,
      httpOnly: true,
      ...(option as any),
    })
    .json({ success: true, role: user.role });
};

export const logout = (req: Request, res: Response) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      maxAge: 0,
      ...(option as any),
    })
    .json({ success: true });
};

export const verify = async (req: Request, res: Response) => {
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
