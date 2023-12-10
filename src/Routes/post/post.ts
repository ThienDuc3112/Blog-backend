import { Router } from "express";
import { MWauth } from "../auth/middleware/MWauth";
import { MWgetUser } from "../auth/middleware/MWgetUser";
import { MWgetPost } from "./middleware/MWgetPost";
import { getPreview } from "./controller/getPreview";
import { getTagPreview } from "./controller/getTagPreview";
import { getPost } from "./controller/getPost";
import { postPost } from "./controller/postPost";
import { patchPost } from "./controller/patchPost";
import { deletePost } from "./controller/deletePost";

const testPostRouter = Router();

testPostRouter.get("/preview", MWgetUser, getPreview); // Get preview with pages
testPostRouter.get("/preview/:tag", MWgetUser, getTagPreview); // Get tags preview with perm
testPostRouter.get("/:id", MWgetPost, MWgetUser, getPost); // Get one post
testPostRouter.post("/:id", MWauth, postPost); // Create a post
testPostRouter.patch("/:id", MWgetUser, getPost, patchPost); // Update a post
testPostRouter.delete("/:id", MWauth, getPost, deletePost); // Delete a post

export default testPostRouter;
