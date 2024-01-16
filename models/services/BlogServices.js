const Blog = require("../Blog");
const customError = require("../../utils/customError");

const getBlogs = () => {
  return Blog.find({}).populate("author");
};

const postBlog = async (data, user) => {
  const blog = new Blog({
    ...data,
    author: user._id,
    likes: data.likes || 0,
  });

  const newBlog = await blog.save();

  user.blogs = user.blogs.concat(blog._id);
  await user.save();

  return newBlog;
};

const deleteBlog = async (id, user) => {
  const blog = await Blog.findById(id);
  if (!blog.author.equals(user._id)) {
    throw new customError.AuthorizationError("Blog owner does not match!");
  }

  return Blog.findByIdAndDelete(id);
};

const updateBlog = async (id, data, user) => {
  const blog = await Blog.findById(id);
  if (!blog.author.equals(user._id)) {
    throw new customError.AuthorizationError("Blog owner does not match!");
  }

  return Blog.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    context: "query",
  });
};

module.exports = {
  getBlogs,
  postBlog,
  deleteBlog,
  updateBlog,
};
