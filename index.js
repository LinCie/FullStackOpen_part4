// Utility
const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");

// Express stuffs
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

// Routers
const blogsRouters = require("./controllers/blogs");

// DB Stuffs
const mongoose = require("mongoose");

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/blogs", blogsRouters);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
