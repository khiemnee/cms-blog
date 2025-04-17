import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments : [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      }
    ]
    ,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Post = new mongoose.model("Post", postSchema);
export default Post;
