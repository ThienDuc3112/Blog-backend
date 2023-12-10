import { Response } from "express";
import { IAuthRequest } from "../../../interface/auth";
import PostModel from "../../../models/post";

export const getTagPreview = async (req: IAuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string);
    const postPerPage = 5;
    if (isNaN(page) || page <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid page request",
      });
    }
    const filter: any = { tags: req.params.tag };
    if (!req.user) {
      filter.isPublic = true;
    } else if (!req.user.role.includes(0)) {
      filter["$or"] = [{ isPublic: true }, { author: req.user.username }];
    }
    const posts = await PostModel.find(filter, { post: 0 })
      .sort({ time: -1, _id: 1 })
      .skip((page - 1) * postPerPage)
      .limit(postPerPage + 1)
      .exec();
    const data = {
      success: true,
      data: {
        preview: posts.slice(0, postPerPage),
        end: false,
      },
    };
    if (posts.length < postPerPage + 1) {
      data.data.end = true;
    }
    res.status(200).json(data);
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
