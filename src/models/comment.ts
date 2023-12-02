import { Schema, model } from "mongoose";
import { IComment } from "../interface/comment";

const commentSchema = new Schema<IComment>({
  date: {
    type: Date,
    default: new Date(),
  },
  postId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: "Anonymous",
  },
});

const CommentModel = model("Comment", commentSchema);

export default CommentModel;
