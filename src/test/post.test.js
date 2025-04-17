import app from "../app";
import request from "supertest";
import { adminUser, commentPostOne, initDataBase, postOneId, user, userId } from "./fixtures/db";
import Post from "../model/post";

beforeEach(initDataBase);

test("create post", async () => {
  await request(app)
    .post("/posts")
    .send({
      title: "day la bai post thu 1",
      content: "day la noi dung cua bai post",
    })
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .expect(201);

  const post = await Post.findOne({ title: "day la bai post thu 1" });
  expect(post).not.toBeNull();
});

test("create post not admin", async () => {
  await request(app)
    .post("/posts")
    .send({
      title: "day la bai post thu 1",
      content: "day la noi dung cua bai post",
    })
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(403);

  const post = await Post.findOne({ title: "day la bai post thu 1" });
  expect(post).toBeNull();
});

test("get post id", async () => {
  const response = await request(app)
    .get(`/posts/${postOneId}`)
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
  expect(response.body.posts._id).toEqual(postOneId.toString());
});

test("admin update post id", async () => {
  const response = await request(app)
    .patch(`/posts/${postOneId}`)
    .send({
      title: "day la noi dung da sua",
    })
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .expect(200);

  expect(response.body.title).toBe("day la noi dung da sua");
});

test("not admin update post id", async () => {
    expect(commentPostOne.user._id).toEqual(userId)
});
