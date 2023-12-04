import { Router } from "express";
import { authenticateMiddleware } from "../controller/auth";
import {
  deleteComment,
  getCommentByPostID,
  postCommentToPost,
} from "../controller/comment";
import { getPost } from "../controller/post";

const commentRouter = Router();

commentRouter.get("/:id", getCommentByPostID);
commentRouter.post("/:id", authenticateMiddleware, getPost, postCommentToPost);
commentRouter.delete("/", authenticateMiddleware, deleteComment);

export default commentRouter;
