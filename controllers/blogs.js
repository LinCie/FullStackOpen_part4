const blogsRouter = require("express").Router();
const BlogServices = require("../models/services/BlogServices");

blogsRouter.get("/", async (request, response, next) => {
  const blogs = await BlogServices.getBlogs();
  response.status(200).json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const blog = await BlogServices.postBlog({
    ...request.body,
    likes: request.body.likes || 0,
  });
  response.status(201).json(blog);
});

module.exports = blogsRouter;
