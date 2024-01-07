const Blog = require("../Blog");

const getBlogs = () => {
  return Blog.find({});
};

module.exports = {
  getBlogs,
};
