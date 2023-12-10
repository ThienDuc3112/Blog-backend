import { Request } from "express";

interface IAuthRequest extends Request {
  user?: {
    username: string;
    iat: number;
    role: number[];
  };
}
export interface IUser {
  username: string;
  password: string;
  email: string;
  role: number[];
  active: boolean;
  verifyToken: string;
  resetToken: string;
  lastRequest: number;
}

export { IAuthRequest };
