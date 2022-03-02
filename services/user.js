const bcrypt = require('bcrypt');

const User = require('../models/user');
const { updateTokens } = require('./token');
const jwt = require('jsonwebtoken');
const Token = require('../models/token');

module.exports.signUp = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hashedPassword });
  await user.save();

  return user;
};

module.exports.logIn = async (email, password) => {
  const user = await User.findOne({ email });
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Entered credentials are invalid' });
  }

  const tokens = await updateTokens(user._id);

  return {tokens, user};
};

module.exports.refresh = async (refreshToken) => {
  const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  if (verifiedToken.type !== 'refresh') {
    return res.status(401).json({ message: 'unauthorized' });
  }

  const token = await Token.findOne({ tokenId: verifiedToken.id });
  if (token === null) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  return await updateTokens(token.userId, token.tokenId, true);
};

module.exports.logOut = async (refreshToken) => {
  const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  return Token.findOneAndRemove({ tokenId: verifiedToken.id });
};
