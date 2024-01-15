const Blog = require("../Blog");
const User = require("../User");

const getBlogs = () => {
  return Blog.find({}).populate("author");
};

const postBlog = async (data) => {
  const user = await User.findOne({});

  const blog = new Blog({
    ...data,
    author: user._id,
    likes: data.likes || 0,
  });

  user.blogs = user.blogs.concat(blog._id);
  await user.save();

  return blog.save();
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
