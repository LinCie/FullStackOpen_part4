const usersRouter = require("express").Router();
const userServices = require("../models/services/UserServices");

usersRouter.post("/", async (request, response, next) => {
  const user = await userServices.signIn(request.body);
  response.status(201).json(user);
});

module.exports = usersRouter;
