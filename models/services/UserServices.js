const User = require("../User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const customError = require("../../utils/customError");

const getUsers = () => {
  return User.find({}).populate("blogs");
};

const signIn = async (user) => {
  const { name, username, password } = user;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name,
    username,
    passwordHash,
  });

  return newUser.save();
};

const logIn = async (userData) => {
  const { username, password } = userData;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    throw new customError.AuthorizationError(
      // eslint-disable-next-line prettier/prettier
      "Invalid Username and/or Password"
    );
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  return { token, username: user.username, name: user.name };
};

module.exports = {
  getUsers,
  signIn,
  logIn,
};
