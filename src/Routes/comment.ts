import { Router } from "express";
import { authMW } from "../controller/auth";
import {
  deleteComment,
  getCommentByPostID,
  postCommentToPost,
} from "../controller/comment";
import { getPost } from "../controller/post";

const commentRouter = Router();

commentRouter.get("/:id", getCommentByPostID);
commentRouter.post("/:id", authMW, getPost, postCommentToPost);
commentRouter.delete("/", authMW, deleteComment);

export default commentRouter;
