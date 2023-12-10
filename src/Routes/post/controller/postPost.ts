import { Response } from "express";
import { IAuthRequest } from "../../../interface/auth";
import PostModel from "../../../models/post";

export const postPost = async (req: IAuthRequest, res: Response) => {
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
