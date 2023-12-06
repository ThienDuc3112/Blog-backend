import { Router } from "express";
import {
  authMW,
  authenticate,
  login,
  logout /**, refresh*/,
  register,
  verify,
} from "../controller/auth";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
// authRouter.get("/refresh", refresh)
authRouter.get("/logout", logout);
authRouter.get("/verify/:token", verify);
authRouter.get("/", authMW, authenticate);

export { authRouter };
