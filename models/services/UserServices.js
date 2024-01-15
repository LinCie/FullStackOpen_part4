const User = require("../User");
const bcrypt = require("bcrypt");

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

module.exports = {
  getUsers,
  signIn,
};
