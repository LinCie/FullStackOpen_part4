const _ = require("lodash");

const dummy = (blogs) => 1;

const totalLikes = (blogs) =>
  blogs
    // Get all the likes from the blogs
    .map((blog) => blog.likes)

    // Sum the likes
    .reduce((a, b) => a + b, 0);

const favoriteBlog = (blogs) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return sortedBlogs[0];
};

const mostBlogs = (blogs) => {
  const blogsCount = _.countBy(blogs, (blog) => blog.author);
  const author = _.maxBy(_.keys(blogsCount), (author) => blogsCount[author]);
  return {
    author: author,
    blogs: blogsCount[author],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
