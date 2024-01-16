const User = require("../models/User");
const usersList = require("./lists/usersList");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const addInitialUser = async () => {
  const { name, username, password } = usersList.initialUserPassword;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name,
    username,
    passwordHash,
  });

  return newUser.save();
};

const getAuthorization = async () => {
  const { username } = usersList.initialUserPassword;

  const user = await User.findOne({ username });

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  return `Bearer ${token}`;
};

const addNewUser = async () => {
  const { name, username, password } = usersList.newUser;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name,
    username,
    passwordHash,
  });

  return newUser.save();
};

const addNewUserAndGetAuthorization = async () => {
  await addNewUser();
  const { username } = usersList.newUser;

  const user = await User.findOne({ username });

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  return `Bearer ${token}`;
};

module.exports = {
  addInitialUser,
  getAuthorization,
  addNewUser,
  addNewUserAndGetAuthorization,
};
