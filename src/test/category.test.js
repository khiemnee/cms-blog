import app from "../app";
import request from "supertest";
import { adminUser, categoryOneId, initDataBase, user } from "./fixtures/db";
import Category from "../model/category";

beforeEach(initDataBase);

test("admin create category", async () => {
  await request(app)
    .post("/categories")
    .send({
      name: "Web Development",
      description:
        "Hướng dẫn và cập nhật công nghệ về phát triển website (frontend & backend).",
    })
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .expect(201);

  const category = await Category.findOne({ name: "Web Development" });
  expect(category).not.toBeNull();
});

test("not admin create category", async () => {
  await request(app)
    .post("/categories")
    .send({
      name: "Web Development",
      description:
        "Hướng dẫn và cập nhật công nghệ về phát triển website (frontend & backend).",
    })
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(403);
});

test("admin delete category", async () => {
  await request(app)
    .delete(`/categories/${categoryOneId}`)
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`).expect(200);

    const categories = await Category.find({})

    expect(categories.length).toEqual(0)
});
