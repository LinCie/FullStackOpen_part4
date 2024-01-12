// Utility
const config = require("./utils/config");
const middleware = require("./utils/middleware");
require("express-async-errors");

// Express stuffs
const cors = require("cors");
const express = require("express");

// Routers
const blogsRouters = require("./controllers/blogs");

// DB Stuffs
const mongoose = require("mongoose");

const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(middleware.requestLogger);
app.use(express.json());
app.use(cors());

app.use("/api/blogs", blogsRouters);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
