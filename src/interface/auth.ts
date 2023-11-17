import { Request } from "express";

interface IAuthRequest extends Request {
  user?: {
    username: string;
    iat: number;
    role: number[];
  };
}

export { IAuthRequest };
