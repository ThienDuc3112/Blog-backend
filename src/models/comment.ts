import { Schema, model } from "mongoose";

interface IComment {
  postId: string;
  date: string;
  message: string;
  username: string;
}

const commentSchema = new Schema<IComment>({
  date: {
    type: String,
    default: new Date().toDateString(),
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
