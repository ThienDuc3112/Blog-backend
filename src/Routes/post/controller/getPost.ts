import { IAuthRequest } from "../../../interface/auth";
import { IResponse } from "../../../interface/post";

export const getPost = (req: IAuthRequest, res: IResponse) => {
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
