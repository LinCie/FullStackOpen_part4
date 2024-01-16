const Blog = require("../Blog");
const User = require("../User");

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

const deleteBlog = (id) => {
  return Blog.findByIdAndDelete(id);
};

const updateBlog = (id, data) => {
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
