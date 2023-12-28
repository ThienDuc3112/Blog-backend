import { Router } from "express";

const testRouter = Router();

testRouter.get("/token", (req, res) => {
  console.log(req.cookies.token);
  res.json({ token: req.cookies.token });
});

export default testRouter;
