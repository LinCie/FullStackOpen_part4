// Utility
const logger = require("./utils/logger");
const config = require("./utils/config");

// Express stuffs
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

// DB Stuffs
const mongoose = require("mongoose");
const BlogServices = require("./models/services/BlogServices");

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/blogs", async (request, response) => {
  try {
    const blogs = await BlogServices.getBlogs();
    response.status(200).json(blogs);
  } catch (err) {
    logger.error(err);
  }
});

app.post("/api/blogs", async (request, response) => {
  try {
    const blog = await BlogServices.postBlog(request.body);
    response.status(201).json(blog);
  } catch (err) {
    logger.error(err);
  }
});

const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
