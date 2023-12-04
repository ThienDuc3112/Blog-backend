import { Response, Request } from "express";
import CommentModel from "../models/comment";
import { IAuthRequest } from "../interface/auth";

export const getCommentByPostID = async (req: Request, res: Response) => {
  try {
    const posts = await CommentModel.find({ postId: req.params.id })
      .sort({
        date: 1,
      })
      .exec();
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

export const postCommentToPost = async (req: IAuthRequest, res: Response) => {
  try {
    if (
      !req.user ||
      (!req.user.role.includes(2) && !req.user.role.includes(0))
    ) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const data = {
      message: req.body.message,
      postId: req.params.id,
      date: new Date(),
      username: req.user.username,
    };
    const comment = new CommentModel(data);
    await comment.save();
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      errMessage: error.message,
    });
  }
};

export const deleteComment = async (req: IAuthRequest, res: Response) => {
  const comment = await CommentModel.findById(req.body._id);
  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "No comment found" });
  }
  if (
    !req.user ||
    (!req.user.role.includes(0) && req.user.username != comment.username)
  ) {
    return res.status(401).json({ success: false, message: "Forbidden" });
  }
  await comment.deleteOne({ _id: req.body._id });
  return res.status(200).json({ success: true });
};
