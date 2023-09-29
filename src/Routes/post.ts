import { Router } from "express";
import { authenticateMiddleware } from "../controller/auth";
import { createPost, deletePost, getAllPost, getAllPreview, getOnePost, getPost, patchPost } from "../controller/post";

const testPostRouter = Router()

testPostRouter.get("/", getAllPost)                 // Get all post
testPostRouter.get("/previewall", getAllPreview)    // Get all preview
testPostRouter.get("/:id",
    getPost,
    getOnePost)                                     // Get one post
testPostRouter.post("/:id",
    authenticateMiddleware,
    createPost)                                     // Create a post
testPostRouter.patch("/:id",
    authenticateMiddleware,
    getPost,
    patchPost)                                      // Update a post
testPostRouter.delete("/:id",
    getPost,
    deletePost)                                     // Delete a post

export default testPostRouter
