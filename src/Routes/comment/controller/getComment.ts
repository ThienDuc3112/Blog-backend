import { Request, Response } from "express";
import CommentModel from "../../../models/comment";

export const getComment = async (req: Request, res: Response) => {
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
