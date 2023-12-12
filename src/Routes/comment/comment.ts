import { Router } from "express";
import { MWauth } from "../auth/middleware/MWauth";
import { getComment } from "./controller/getComment";
import { postComment } from "./controller/postComment";
import { deleteComment } from "./controller/deleteComment";
import { MWgetPost } from "../post/middleware/MWgetPost";

const commentRouter = Router();

commentRouter.get("/:id", getComment);
commentRouter.post("/:id", MWauth, MWgetPost, postComment);
commentRouter.delete("/", MWauth, deleteComment);

export default commentRouter;
