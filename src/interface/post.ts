import { Response } from "express";
import { Document } from "mongoose";

interface IPost {
  title: string;
  description: string;
  tags: string[];
  post: string;
  isPublic: boolean;
  time: Date;
  lastEdit: Date;
  readTime: number;
  id: string;
  author: string;
}

interface IResponse extends Response {
  post?: Document<unknown, {}, IPost> & IPost;
}

export { IResponse, IPost };
