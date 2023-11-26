import { NextFunction, Request, Response } from "express";
import PostModel from "../models/post";
import { IResponse } from "../interface/post";
import { IAuthRequest } from "../interface/auth";

const getAllPost = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllPreview = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find({}, { post: 0 });
    res.status(200).json({
      success: true,
      data: [...(posts as any)].map((post) => {
        post.post = undefined;
        return post;
      }),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPost = async function getPost(
  req: Request,
  res: IResponse,
  next: NextFunction
) {
  let post;
  try {
    post = await PostModel.findOne({ id: req.params.id });
    if (post === null) {
      return res.status(404).json({
        success: false,
        message: "Cannot find post",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  res.post = post;
  next();
};

const getOnePost = (req: Request, res: IResponse) => {
  res.status(200).json({
    success: true,
    data: res.post,
  });
};

const createPost = async (req: IAuthRequest, res: Response) => {
  try {
    const post = new PostModel({
      ...req.body,
      id: req.params.id,
      author: req.user?.username ?? "Anonymous",
    });
    await post.save();
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      errMessage: error.message,
    });
  }
};

const patchPost = async (req: Request, res: IResponse) => {
  try {
    await res.post?.updateOne({ ...req.body });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePost = async (req: Request, res: IResponse) => {
  try {
    await res.post?.deleteOne();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

export {
  getAllPost,
  getAllPreview,
  getPost,
  getOnePost,
  createPost,
  patchPost,
  deletePost,
};
