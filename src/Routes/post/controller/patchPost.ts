import { IAuthRequest } from "../../../interface/auth";
import { IResponse } from "../../../interface/post";

export const patchPost = async (req: IAuthRequest, res: IResponse) => {
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
