import express from "express";
import cors from "cors";
import postRouter from "./Routes/post";
import mongoose from "mongoose";
import env from "dotenv";
import { authRouter } from "./Routes/auth";
import cookieParser from "cookie-parser";
import commentRouter from "./Routes/comment";
env.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));

mongoose.connect(process.env.DATABASE_URL as string);

const db = mongoose.connection;
db.on("error", (err) => {
  console.error(err);
});
db.once("open", () => {
  console.log("Connected to db");
});

const port = 6969;
app.listen(port, () => console.log(`Server listen on port ${port}`));

app.use("/post", postRouter);
app.use("/auth", authRouter);
app.use("/comment", commentRouter);
