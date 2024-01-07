const blogsRouter = require("express").Router();
const BlogServices = require("../models/services/BlogServices");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await BlogServices.getBlogs();
    response.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const blog = await BlogServices.postBlog(request.body);
    response.status(201).json(blog);
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;
