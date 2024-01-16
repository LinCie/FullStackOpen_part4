const blogsRouter = require("express").Router();
const BlogServices = require("../models/services/BlogServices");
const middleware = require("../utils/middleware");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

blogsRouter.get("/", async (request, response, next) => {
  const blogs = await BlogServices.getBlogs();
  response.status(200).json(blogs);
});

blogsRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    const blog = await BlogServices.postBlog(request.body, request.user);
    response.status(201).json(blog);
    // eslint-disable-next-line prettier/prettier
  }
);

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    await BlogServices.deleteBlog(request.params.id, request.user);
    response.status(204).end();
    // eslint-disable-next-line prettier/prettier
  }
);

blogsRouter.put(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    const blog = await BlogServices.updateBlog(
      request.params.id,
      request.body,
      request.user,
    );
    response.status(201).json(blog);
    // eslint-disable-next-line prettier/prettier
  }
);

module.exports = blogsRouter;
