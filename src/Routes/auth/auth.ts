import { Router } from "express";
import { postRegister } from "./controller/postRegister";
import { postLogin } from "./controller/postLogin";
import { getLogout } from "./controller/getLogout";
import { getVerify } from "./controller/getVerify";
import { getAuthenticate } from "./controller/getAuthenticate";
import { postReset } from "./controller/postReset";
import { postResetPassword } from "./controller/postResetPassword";
import { getVerifyResetToken } from "./controller/getVerifyResetToken";
import { MWauthHeader } from "./middleware/MWauthWithHeader";

const authRouter = Router();

authRouter.get("/", MWauthHeader, getAuthenticate);
authRouter.get("/logout", getLogout);
authRouter.get("/verify/:token", getVerify);
authRouter.get("/reset/:token", getVerifyResetToken);

authRouter.post("/register", postRegister);
authRouter.post("/login", postLogin);
authRouter.post("/reset", postReset);
authRouter.post("/reset/:token", postResetPassword);

export default authRouter;
