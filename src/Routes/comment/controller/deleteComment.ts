import { Response } from "express";
import { IAuthRequest } from "../../../interface/auth";
import CommentModel from "../../../models/comment";

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
