import { NextFunction, Request, Response } from "express";
import PostModel from "../models/post";
import { IResponse } from "../interface/post";
import { IAuthRequest } from "../interface/auth";

const getAllPreview = async (req: IAuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string);
    const postPerPage = 5;
    if (isNaN(page) || page <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid page request",
      });
    }
    const filter: any = {};
    if (!req.user) {
      filter.isPublic = true;
    } else if (!req.user.role.includes(0)) {
      filter["$or"] = [{ isPublic: true }, { author: req.user.username }];
    }
    const posts = await PostModel.find(filter, { post: 0 })
      .sort({ time: -1, _id: 1 })
      .skip((page - 1) * postPerPage)
      .limit(postPerPage + 1)
      .exec();
    const data = {
      success: true,
      data: {
        preview: posts.slice(0, postPerPage),
        end: false,
      },
    };
    if (posts.length < postPerPage + 1) {
      data.data.end = true;
    }
    res.status(200).json(data);
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTagPreview = async (req: IAuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string);
    const postPerPage = 5;
    if (isNaN(page) || page <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid page request",
      });
    }
    const filter: any = { tags: req.params.tag };
    if (!req.user) {
      filter.isPublic = true;
    } else if (!req.user.role.includes(0)) {
      filter["$or"] = [{ isPublic: true }, { author: req.user.username }];
    }
    const posts = await PostModel.find(filter, { post: 0 })
      .sort({ time: -1, _id: 1 })
      .skip((page - 1) * postPerPage)
      .limit(postPerPage + 1)
      .exec();
    const data = {
      success: true,
      data: {
        preview: posts.slice(0, postPerPage),
        end: false,
      },
    };
    if (posts.length < postPerPage + 1) {
      data.data.end = true;
    }
    res.status(200).json(data);
    return;
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

const getOnePost = (req: IAuthRequest, res: IResponse) => {
  if (!(res.post as any).isPublic) {
    if (!req.user)
      return res.status(401).json({ success: false, message: "No login" });
    const author = ((res.post as any).author as string).toLowerCase().trim();
    if (
      req.user.role.indexOf(0) < 0 &&
      author !== req.user.username.toLowerCase().trim()
    ) {
      return res.status(401).json({ success: false, message: "Unauthorize" });
    }
  }
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
      author: req.user?.username ?? "anonymous",
      readTime: Math.round(req.body.post.split(" ").length / 200),
      time: new Date(),
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

const patchPost = async (req: IAuthRequest, res: IResponse) => {
  try {
    if (
      !req.user ||
      (!req.user.role.includes(0) &&
        req.user.username != (res.post as any).author)
    ) {
      return res.status(401).json({
        success: false,
        message: "You don't have the permission to edit this",
      });
    }
    await res.post?.updateOne({
      ...req.body,
      lastEdit: new Date(),
      readTime: Math.round(req.body.post.split(" ").length / 200),
    });
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
  getPost,
  getOnePost,
  createPost,
  patchPost,
  deletePost,
  getTagPreview,
  getAllPreview,
};
