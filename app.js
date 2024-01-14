// Utility
const config = require("./utils/config");
const middleware = require("./utils/middleware");
require("express-async-errors");

// Express stuffs
const cors = require("cors");
const express = require("express");

// Routers
const usersRouter = require("./controllers/users");
const blogsRouter = require("./controllers/blogs");

// DB Stuffs
const mongoose = require("mongoose");

const app = express();

mongoose.connect(config.MONGODB_URI, {
  dbName:
    process.env.NODE_ENV === "production"
      ? "FullStackOpenBlogs"
      : "FullStackOpenBlogsTest",
});

app.use(middleware.requestLogger);
app.use(express.json());
app.use(cors());

app.use("/api/users", usersRouter);
app.use("/api/blogs", blogsRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
