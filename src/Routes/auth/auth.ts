import { Router } from "express";
import { postRegister } from "./controller/postRegister";
import { postLogin } from "./controller/postLogin";
import { getLogout } from "./controller/getLogout";
import { getVerify } from "./controller/getVerify";
import { MWauth } from "./middleware/MWauth";
import { getAuthenticate } from "./controller/getAuthenticate";
import { postReset } from "./controller/postReset";

const authRouter = Router();

authRouter.get("/", MWauth, getAuthenticate);
authRouter.get("/logout", getLogout);
authRouter.get("/verify/:token", getVerify);

authRouter.post("/register", postRegister);
authRouter.post("/login", postLogin);
authRouter.post("/reset", postReset);
authRouter.post("/reset/:token");

export { authRouter };
