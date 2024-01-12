const listHelper = require("../utils/listHelper");
const blogsList = require("./blogsList");

describe("Test Function", () => {
  it("dummy returns 1", () => {
    const dummy = listHelper.dummy();

    expect(dummy).toBe(1);
  });
});

describe("Total Likes", () => {
  it("of empty list is 0", () => {
    const totalLikes = listHelper.totalLikes([]);

    expect(totalLikes).toBe(0);
  });

  it("of one blog is the likes of that blog", () => {
    const totalLikes = listHelper.totalLikes(blogsList.listWithOneBlog);

    expect(totalLikes).toBe(5);
  });

  it("shows correct total", () => {
    const totalLikes = listHelper.totalLikes(blogsList.blogs);

    expect(totalLikes).toBe(36);
  });
});

it("favoriteBlogs returns a blog with the most likes", () => {
  const favoriteBlog = listHelper.favoriteBlog(blogsList.blogs);

  expect(favoriteBlog).toEqual(blogsList.blogs[2]);
});

it("shows correct author with the most blogs", () => {
  const mostBlogs = listHelper.mostBlogs(blogsList.blogs);
  expect(mostBlogs).toEqual({ author: "Robert C. Martin", blogs: 3 });
});
