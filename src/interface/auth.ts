import { Request } from "express";

interface IAuthRequest extends Request {
  user?: {
    username: string;
    iat: number;
  };
}

export { IAuthRequest };
