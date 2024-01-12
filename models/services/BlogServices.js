const Blog = require("../Blog");

const getBlogs = () => {
  return Blog.find({});
};

const postBlog = (data) => {
  const blog = new Blog({
    ...data,
    likes: data.likes || 0,
  });
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
