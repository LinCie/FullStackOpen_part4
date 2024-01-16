const mongoose = require("mongoose");
const supertest = require("supertest");

const blogsList = require("../utils/lists/blogsList");
const Blog = require("../models/Blog");

const User = require("../models/User");

const testHelper = require("../utils/testHelper");

const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const user = await testHelper.addInitialUser();

  for (const blog of blogsList.blogs) {
    const blogObject = new Blog({
      ...blog,
      author: user._id,
    });
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
    const requestBody = {
      ...blogsList.newBlog,
    };
    delete requestBody.author;

    const authorization = await testHelper.getAuthorization();

    const response = await api
      .post("/api/blogs")
      .send(requestBody)
      .set("Authorization", authorization);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(requestBody);

    const newBlog = await Blog.findOne(requestBody);
    expect(newBlog).toBeDefined();
  });

  it("missing request likes will default to 0", async () => {
    const requestBody = {
      ...blogsList.newBlog,
    };
    delete requestBody.author;
    delete requestBody.likes;

    const authorization = await testHelper.getAuthorization();

    const response = await api
      .post("/api/blogs")
      .send(requestBody)
      .set("Authorization", authorization);

    expect(response.status).toBe(201);
    expect(response.body.likes).toBe(0);
  });

  describe("when handling bad request", () => {
    it("can handle where title is missing", async () => {
      const requestBody = {
        ...blogsList.newBlog,
      };
      delete requestBody.author;
      delete requestBody.title;

      const authorization = await testHelper.getAuthorization();

      const response = await api
        .post("/api/blogs")
        .send(requestBody)
        .set("Authorization", authorization);

      expect(response.status).toBe(400);
    });

    it("can handle where url is missing", async () => {
      const requestBody = {
        ...blogsList.newBlog,
      };
      delete requestBody.author;
      delete requestBody.url;

      const authorization = await testHelper.getAuthorization();

      const response = await api
        .post("/api/blogs")
        .send(requestBody)
        .set("Authorization", authorization);

      expect(response.status).toBe(400);
    });

    it("can handle where authorization is missing", async () => {
      const requestBody = {
        ...blogsList.newBlog,
      };
      delete requestBody.author;

      const response = await api.post("/api/blogs").send(requestBody);

      expect(response.status).toBe(401);
    });
  });
});

describe("Deleting a blog", () => {
  it("can delete a blog", async () => {
    const authorization = await testHelper.getAuthorization();
    const response = await api
      .delete(`/api/blogs/${blogsList.blogs[0]._id}`)
      .set("Authorization", authorization);

    expect(response.status).toBe(204);
  });

  describe("Authorization test", () => {
    it("rejects when the jwt is missing", async () => {
      const response = await api.delete(`/api/blogs/${blogsList.blogs[0]._id}`);

      expect(response.status).toBe(401);
    });

    it("rejects when the author is different", async () => {
      const authorization = await testHelper.addNewUserAndGetAuthorization();
      const response = await api
        .delete(`/api/blogs/${blogsList.blogs[0]._id}`)
        .set("Authorization", authorization);

      expect(response.status).toBe(401);
    });
  });
});

describe("Updating a blog", () => {
  it("can update a blog", async () => {
    const requestBody = blogsList.newBlog;
    delete requestBody.author;

    const authorization = await testHelper.getAuthorization();

    const response = await api
      .put(`/api/blogs/${blogsList.blogs[0]._id}`)
      .send(requestBody)
      .set("Authorization", authorization);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(requestBody);
  });

  describe("Authorization test", () => {
    it("rejects when the jwt is missing", async () => {
      const requestBody = blogsList.newBlog;
      delete requestBody.author;

      const response = await api
        .put(`/api/blogs/${blogsList.blogs[0]._id}`)
        .send(requestBody);

      expect(response.status).toBe(401);
    });

    it("rejects when the author is different", async () => {
      const requestBody = blogsList.newBlog;
      delete requestBody.author;

      const authorization = await testHelper.addNewUserAndGetAuthorization();

      const response = await api
        .put(`/api/blogs/${blogsList.blogs[0]._id}`)
        .send(requestBody)
        .set("Authorization", authorization);

      expect(response.status).toBe(401);
    });
  });
});

afterAll(async () => {
  await Blog.deleteMany({});
  await mongoose.connection.close();
});
