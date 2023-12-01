import { Router } from "express";
import {
  authenticateMiddleware as authBlock,
  getUser,
} from "../controller/auth";
import {
  createPost,
  deletePost,
  getOnePost,
  getPost,
  getTagPreview,
  patchPost,
  getAllPreview,
} from "../controller/post";

const testPostRouter = Router();

testPostRouter.get("/preview", getUser, getAllPreview); // Get preview with pages
testPostRouter.get("/preview/:tag", getUser, getTagPreview); // Get tags preview with perm
testPostRouter.get("/:id", getPost, getUser, getOnePost); // Get one post
testPostRouter.post("/:id", authBlock, createPost); // Create a post
testPostRouter.patch("/:id", getUser, getPost, patchPost); // Update a post
testPostRouter.delete("/:id", authBlock, getPost, deletePost); // Delete a post

export default testPostRouter;
