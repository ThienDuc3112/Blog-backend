import { Response, Request } from "express";
import CommentModel from "../models/comment";

const getCommentByPostID = async (req: Request, res: Response) => {
  try {
    const posts = await CommentModel.find({ postId: req.params.id });
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

const postCommentToPost = async (req: Request, res: Response) => {
  try {
    const comment = new CommentModel({ ...req.body, postId: req.params.id });
    await comment.save();
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      errMessage: error.message,
    });
  }
};

export { getCommentByPostID, postCommentToPost };
