const bcrypt = require('bcrypt');
const UUID = require('uuid');

const User = require('../models/user');
const { updateTokens } = require('./token');
const jwt = require('jsonwebtoken');
const Token = require('../models/token');

module.exports.signUp = async (email, password) => {
  const isEmailUsed = await User.findOne({ email });
  if (isEmailUsed) {
    throw new Error('Email already taken');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const activationLink = UUID.v4();

  const user = new User({ email, password: hashedPassword, activationLink });
  await user.save();

  return user;
};

module.exports.logIn = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('There is no user with this email');
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error('Entered credentials are invalid');
  }

  const tokens = await updateTokens(user._id);

  return { tokens, user };
};

module.exports.refresh = async (refreshToken) => {
  const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  if (verifiedToken.type !== 'refresh') {
    throw new Error('You are unauthorized');
  }

  const token = await Token.findOne({ tokenId: verifiedToken.id });
  if (token === null) {
    throw new Error('The token is invalid');
  }

  return await updateTokens(token.userId, token.tokenId, true);
};

module.exports.logOut = async (refreshToken) => {
  const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  return Token.findOneAndRemove({ tokenId: verifiedToken.id });
};
