import { Response } from "express";
import { IAuthRequest } from "../../../interface/auth";
import CommentModel from "../../../models/comment";

export const postComment = async (req: IAuthRequest, res: Response) => {
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
