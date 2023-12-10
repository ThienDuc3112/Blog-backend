import { NextFunction, Request } from "express";
import { IResponse } from "../../../interface/post";
import PostModel from "../../../models/post";

export const MWgetPost = async function getPost(
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
