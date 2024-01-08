const dummy = (blogs) => 1;

const totalLikes = (blogs) =>
  blogs
    // Get all the likes from the blogs
    .map((blog) => blog.likes)

    // Sum the likes
    .reduce((a, b) => a + b, 0);

module.exports = {
  dummy,
  totalLikes,
};
