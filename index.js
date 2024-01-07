require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const BlogServices = require("./models/services/BlogServices");
const morgan = require("morgan");

mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/blogs", async (request, response) => {
  try {
    const blogs = await BlogServices.getBlogs();
    response.status(200).json(blogs);
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/blogs", async (request, response) => {
  try {
    const blog = await BlogServices.postBlog(request.body);
    response.status(201).json(blog);
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
