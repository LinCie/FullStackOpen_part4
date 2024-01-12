const mongoose = require("mongoose");
const supertest = require("supertest");

const listHelper = require("../utils/listHelper");
const blogsList = require("./blogsList");
const Blog = require("../models/Blog");

const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (const blog of blogsList.blogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
});

it("dummy returns 1", () => {
  const dummy = listHelper.dummy();

  expect(dummy).toBe(1);
});

describe("Total Likes", () => {
  it("of empty list is 0", () => {
    const totalLikes = listHelper.totalLikes([]);

    expect(totalLikes).toBe(0);
  });

  it("of one blog is the likes of that blog", () => {
    const totalLikes = listHelper.totalLikes(blogsList.listWithOneBlog);

    expect(totalLikes).toBe(5);
  });

  it("shows correct total", () => {
    const totalLikes = listHelper.totalLikes(blogsList.blogs);

    expect(totalLikes).toBe(36);
  });
});

it("favoriteBlogs returns a blog with the most likes", () => {
  const favoriteBlog = listHelper.favoriteBlog(blogsList.blogs);

  expect(favoriteBlog).toEqual(blogsList.blogs[2]);
});

it("shows correct author with the most blogs", () => {
  const mostBlogs = listHelper.mostBlogs(blogsList.blogs);
  expect(mostBlogs).toEqual({ author: "Robert C. Martin", blogs: 3 });
});

describe("Blogs API", () => {
  it("successfully GET the blogs", async () => {
    const response = await api.get("/api/blogs");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(blogsList.blogs.length);
  });

  it("have id property to be defined", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
    expect(response.body[0]._id).toBeUndefined();
  });

  it("can POST new blog", async () => {
    const postResponse = await api.post("/api/blogs").send(blogsList.newBlog);

    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toMatchObject(blogsList.newBlog);

    const newBlog = await Blog.findOne(blogsList.newBlog);
    expect(newBlog).toBeDefined();

    await Blog.deleteOne(blogsList.newBlog);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
