const usersRouter = require("express").Router();
const userServices = require("../models/services/UserServices");

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;
  if (!username || !name || !password) {
    response.status(400).json({ error: "Invalid Request" });
  }

  const user = await userServices.signIn(request.body);
  response.status(201).json(user);
});

module.exports = usersRouter;
