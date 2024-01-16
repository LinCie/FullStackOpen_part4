const blogsRouter = require("express").Router();
const BlogServices = require("../models/services/BlogServices");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.get("/", async (request, response, next) => {
  const blogs = await BlogServices.getBlogs();
  response.status(200).json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const blog = await BlogServices.postBlog(request.body, user);
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
