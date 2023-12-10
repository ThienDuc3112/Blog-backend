import { Request } from "express";
import { IResponse } from "../../../interface/post";

export const deletePost = async (req: Request, res: IResponse) => {
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
