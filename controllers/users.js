const usersRouter = require("express").Router();
const userServices = require("../models/services/UserServices");

usersRouter.get("/", async (request, response, next) => {
  const users = await userServices.getUsers();
  response.status(200).json(users);
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;
  if (!username || !name || !password) {
    response.status(400).json({ error: "Invalid Request" });
  }

  if (username.length < 3 || password.length < 3) {
    response.status(400).json({
      error: "Username and/or Password must at least 3 characters long",
    });
  }

  const user = await userServices.signIn(request.body);
  response.status(201).json(user);
});

module.exports = usersRouter;
