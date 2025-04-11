import express from "express";
import checkAuth from "../middleware/auth.js";
import Comment from "../model/comment.js";
import Post from "../model/post.js";

const commentRouter = new express.Router();

commentRouter.post("/comments/:postId", checkAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).send({
        error: "post not found",
      });
    }

    const comment = new Comment({
      ...req.body,
      user: req.user._id,
      post: req.params.postId,
    });

    post.comments.push(comment);
    await post.save();
    await comment.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

commentRouter.get("/comments/:postId", checkAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).send({
        error: "post not found",
      });
    }

    res.status(200).send(post.comments);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

commentRouter.patch("/comments/:commentId", checkAuth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["text"];

    const isMatch = updates.every((values) => allowedUpdates.includes(values));

    if (!isMatch) {
      return res.status(400).send({
        error: "invalid field",
      });
    }

    const comment = await Comment.findOne({
      _id: req.params.commentId,
      user: req.user._id,
    });

    const post = await Post.findOne({ "comments._id": req.params.commentId });

    if (!post) {
      return res.status(404).send({
        error: "comment not found",
      });
    }

    if (!comment) {
      return res.status(404).send({
        error: "comment not found",
      });
    }

    const postCommentIndex = post.comments.findIndex((values) =>
      values._id.equals(req.params.commentId)
    );

    if (postCommentIndex >= 0) {
      post.comments[postCommentIndex].text = req.body.text;
      await post.save();
    }

    comment.text = req.body.text;

    await comment.save();

    res.status(200).send(comment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

commentRouter.delete("/comments/:commentId", checkAuth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const post = await Post.findOne({ "comments._id": req.params.commentId });

    if (!comment) {
        return res.status(404).send({ error: "comment not found" });
      }
  
      if (!post) {
        return res.status(404).send({ error: "post not found" });
      }

    if (!comment.user.equals(req.user._id) || req.user.role !== "admin") {
      return res
        .status(403)
        .send({ error: "Not authorized to update this comment" });
    }

    const postCommentIndex = post.comments.findIndex((values) =>
      values._id.equals(req.params.commentId)
    );

    if (postCommentIndex >= 0) {
      post.comments.splice(postCommentIndex, 1);
      await post.save();
    }

    await Comment.deleteOne({ _id: comment._id });

    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default commentRouter;
