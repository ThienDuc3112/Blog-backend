import { Router } from "express";
import {
  authenticate,
  authenticateMiddleware,
  login,
  logout /**, refresh*/,
  register,
} from "../controller/auth";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
// authRouter.get("/refresh", refresh)
authRouter.get("/logout", logout);
authRouter.get("/", authenticateMiddleware, authenticate);

export { authRouter };
