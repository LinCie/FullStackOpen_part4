const blogsRouter = require("express").Router();
const BlogServices = require("../models/services/BlogServices");

blogsRouter.get("/", async (request, response, next) => {
  const blogs = await BlogServices.getBlogs();
  response.status(200).json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const blog = await BlogServices.postBlog(request.body);
  response.status(201).json(blog);
});

blogsRouter.delete("/:id", async (request, response, next) => {
  await BlogServices.deleteBlog(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response, next) => {
  const blog = await BlogServices.updateBlog(request.params.id, request.body);
  response.status(201).json(blog);
});

module.exports = blogsRouter;
