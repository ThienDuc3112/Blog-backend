import { Router } from "express";
import {
  authenticateMiddleware,
  nonReturnAuthMidware,
} from "../controller/auth";
import {
  createPost,
  deletePost,
  getAllPost,
  getAllPreview,
  getOnePost,
  getPost,
  getPreviewWithPerm,
  getTagPreviewWithPerm,
  patchPost,
} from "../controller/post";

const testPostRouter = Router();

testPostRouter.get("/", getAllPost); // Get all post
testPostRouter.get("/previewall", getAllPreview); // Get all preview
testPostRouter.get("/preview", nonReturnAuthMidware, getPreviewWithPerm); // Get preview with perm
testPostRouter.get(
  "/preview/:tag",
  nonReturnAuthMidware,
  getTagPreviewWithPerm
); // Get tags preview with perm
testPostRouter.get("/:id", getPost, nonReturnAuthMidware, getOnePost); // Get one post
testPostRouter.post("/:id", authenticateMiddleware, createPost); // Create a post
testPostRouter.patch("/:id", authenticateMiddleware, getPost, patchPost); // Update a post
testPostRouter.delete("/:id", authenticateMiddleware, getPost, deletePost); // Delete a post

export default testPostRouter;
