const blogsRouter = require("express").Router();
const BlogServices = require("../models/services/BlogServices");

const logger = require("../utils/logger");

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await BlogServices.getBlogs();
    response.status(200).json(blogs);
  } catch (err) {
    logger.error(err);
  }
});

blogsRouter.post("/", async (request, response) => {
  try {
    const blog = await BlogServices.postBlog(request.body);
    response.status(201).json(blog);
  } catch (err) {
    logger.error(err);
  }
});

module.exports = blogsRouter;
