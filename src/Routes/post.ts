import { NextFunction, Request, Response, Router } from "express";
import PostModel from "../models/post";
import { Document } from "mongoose";
import { IAuthRequest, authenticate } from "./auth";

const testPostRouter = Router()

// Get all post
testPostRouter.get("/", async (req, res) => {
    try {
        const posts = await PostModel.find()
        res.status(200).json({
            success: true,
            data: posts
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Get all preview
testPostRouter.get("/previewall", async (req, res) => {
    try {
        const posts = await PostModel.find({}, { post: 0 })
        res.status(200).json({
            success: true,
            data: [...posts as any].map(post => {
                post.post = undefined
                return post
            })
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Get one post
testPostRouter.get("/:id", getPost, (req, res: IResponse) => {
    res.status(200).json({
        success: true,
        data: res.post
    })
})

// Create a post
testPostRouter.post("/:id", authenticate, async (req: IAuthRequest, res) => {
    try {
        console.log(req.user)
        const post = new PostModel({ ...req.body, id: req.params.id })
        await post.save()
        res.status(201).json({ success: true })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            errMessage: error.message
        })
    }
})

// Update a post
testPostRouter.patch("/:id", getPost, async (req, res: IResponse) => {
    try {
        await res.post?.updateOne({ ...req.body })
        res.json({ success: true })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Delete a post
testPostRouter.delete("/:id", getPost, async (req, res: IResponse) => {
    try {
        await res.post?.deleteOne()
        res.json({ success: true })
    } catch (error: any) {
        res.status(500).json({
            success: true,
            message: error.message
        })
    }
})


// Middleware
interface IResponse extends Response {
    post?: Document
}

async function getPost(req: Request, res: IResponse, next: NextFunction) {
    let post
    try {
        post = await PostModel.findOne({ id: req.params.id })
        if (post === null) {
            return res.status(404).json({
                success: false,
                message: "Cannot find post"
            })
        }
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
    res.post = post
    next()
}

export default testPostRouter
