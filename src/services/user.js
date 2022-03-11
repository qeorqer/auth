const UUID = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Token = require('../models/token');
const { updateTokens } = require('./token');
const { sendActivationMail } = require('./mail');
const ApiError = require('../exceptions/ApiErrors');

module.exports.signUp = async (email, password) => {
  const isEmailUsed = await User.findOne({ email });
  if (isEmailUsed) {
    throw ApiError.BadRequest('Email already taken');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const activationLink = UUID.v4();

  const user = new User({ email, password: hashedPassword, activationLink });
  await user.save();

  sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`);
};

module.exports.logIn = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw ApiError.BadRequest('There is no user with this email');
  }

  if (!user.isActivated) {
    throw ApiError.Forbidden('Account has to be activated first. Check your email');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw ApiError.BadRequest('Entered credentials are invalid');
  }

  const tokens = await updateTokens(user._id);

  return { tokens, user };
};

module.exports.refresh = async (refreshToken) => {
  const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  if (verifiedToken.type !== 'refresh') {
    throw ApiError.UnauthorizedError('You are unauthorized');
    throw new Error('');
  }

  const token = await Token.findOne({ tokenId: verifiedToken.id });
  if (token === null) {
    throw ApiError.BadRequest('The token is invalid');
  }

  return await updateTokens(token.userId, token.tokenId, true);
};

module.exports.logOut = async (refreshToken) => {
  const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  return Token.findOneAndRemove({ tokenId: verifiedToken.id });
};

module.exports.activate = async (activationLink) => {
  const user = await User.findOne({ activationLink });

  if (!user) {
    throw ApiError.BadRequest('Invalid link');
  }

  user.isActivated = true;
  await user.save();
};