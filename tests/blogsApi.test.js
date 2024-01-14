const mongoose = require("mongoose");
const supertest = require("supertest");

const blogsList = require("./lists/blogsList");
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

describe("Getting the blogs", () => {
  it("successfully get the blogs", async () => {
    const response = await api.get("/api/blogs");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(blogsList.blogs.length);
  });

  it("have id property to be defined", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
    expect(response.body[0]._id).toBeUndefined();
  });
});

describe("Posting a new blog", () => {
  it("can post new blog", async () => {
    const response = await api.post("/api/blogs").send(blogsList.newBlog);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(blogsList.newBlog);

    const newBlog = await Blog.findOne(blogsList.newBlog);
    expect(newBlog).toBeDefined();
  });

  it("missing request likes will default to 0", async () => {
    const requestBody = { ...blogsList.newBlog };
    delete requestBody.likes;

    const response = await api.post("/api/blogs").send(requestBody);

    expect(response.status).toBe(201);
    expect(response.body.likes).toBe(0);
  });

  describe("when handling bad request", () => {
    it("can handle where title is missing", async () => {
      const requestBody = { ...blogsList.newBlog };
      delete requestBody.title;

      const response = await api.post("/api/blogs").send(requestBody);

      expect(response.status).toBe(400);
    });

    it("can handle where url is missing", async () => {
      const requestBody = { ...blogsList.newBlog };
      delete requestBody.url;

      const response = await api.post("/api/blogs").send(requestBody);

      expect(response.status).toBe(400);
    });

    it("can handle where author is missing", async () => {
      const requestBody = { ...blogsList.newBlog };
      delete requestBody.author;

      const response = await api.post("/api/blogs").send(requestBody);

      expect(response.status).toBe(400);
    });
  });
});

describe("Deleting a blog", () => {
  it("can delete a blog", async () => {
    const response = await api.delete(`/api/blogs/${blogsList.blogs[0]._id}`);

    expect(response.status).toBe(204);
  });
});

describe("Updating a blog", () => {
  it("can update a blog", async () => {
    const response = await api
      .put(`/api/blogs/${blogsList.blogs[0]._id}`)
      .send(blogsList.newBlog);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(blogsList.newBlog);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
