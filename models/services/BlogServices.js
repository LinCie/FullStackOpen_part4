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

module.exports = {
  getBlogs,
  postBlog,
};
