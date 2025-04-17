import express, { json } from "express";
import checkAuth from "../middleware/auth.js";
import checkRole from "../middleware/role.js";
import Post from "../model/post.js";
import {
  checkCachePost,
  checkCachePostCate,
} from "../middleware/post/checkPostCache.js";
import client from "../redis/redis.js";

const postRouter = new express.Router();

postRouter.post("/posts", checkAuth, checkRole("admin"), async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      author: req.user._id,
    });
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

postRouter.get("/posts", checkAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    const posts = await Post.find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("author")
      .populate("category");

    if (!posts) {
      return res.status(404).send({
        error: "posts not found",
      });
    }

    res.status(201).send(posts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

postRouter.get("/posts/:id", checkAuth, checkCachePost, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id)
      .populate("category")
      .populate("author");

    if (!posts) {
      return res.status(404).send({
        error: "posts not found",
      });
    }

    if (req.postKey) {
      await client.setEx(req.postKey, 60, JSON.stringify(posts));
    }

    if (req.postViews) {
      await client.incr(req.postViews);
    }

    const views = await client.get(req.postViews);
    await posts.save();

    res.status(200).send({ posts, views });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

postRouter.get(
  "/posts/category/:id",
  checkAuth,
  checkCachePostCate,
  async (req, res) => {
    try {
      const posts = await Post.findMany({ category: req.params.id })
        .populate("category")
        .populate("author");

      if (!posts) {
        return res.status(404).send({
          error: "posts not found",
        });
      }

      if (req.postKey) {
        await client.setEx(req.postKey, 60, JSON.stringify(posts));
      }

      res.status(200).send(posts);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

postRouter.delete(
  "/posts/:id",
  checkAuth,
  checkRole("admin"),
  async (req, res) => {
    try {
      const posts = await Post.findById(req.params.id);

      if (!posts) {
        return res.status(404).send({
          error: "posts not found",
        });
      }

      await Post.deleteOne({ _id: posts._id });

      res.status(201).send(posts);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

postRouter.patch(
  "/posts/:id",
  checkAuth,
  checkRole("admin"),
  async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).send("user not found");
      }

      const allowed = ["title", "content", "tag", "author", "category"];

      const isAllowed = updates.every((values) => allowed.includes(values));

      if (!isAllowed) {
        return res.status(400).send({
          error: "field is invalid",
        });
      }

      updates.forEach((value) => (post[value] = req.body[value]));

      await post.save();

      res.status(200).send(post);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

export default postRouter;
