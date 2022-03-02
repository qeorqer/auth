const jwt = require('jsonwebtoken');
const UUID = require('uuid');
const Token = require('../models/token');

const generateAccessToken = (userId) => {
  return jwt.sign(
      { userId, type: 'access' },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' },
    );
};

const generateRefreshToken = () => {
  const uuid = UUID.v4();
  return {
    token: jwt
      .sign({ id: uuid, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' }),
    id: uuid,
  };
};

const replaceDbRefreshToken = async (
  {
    newTokenId, oldTokenId, userId, update,
  }) => {
  if (update) {
    await Token.findOneAndRemove({ tokenId: oldTokenId });
  }

  return Token.create({ tokenId: newTokenId, userId });
};

const updateTokens = async (userId, tokenId, update = false) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();
  const accessExpiration = new Date(new Date().getTime() + 15 * 60000).valueOf();

  await replaceDbRefreshToken({
    newTokenId: refreshToken.id,
    oldTokenId: tokenId,
    userId,
    update,
  });

  return { accessToken, refreshToken: refreshToken.token, accessExpiration };
};

module.exports = updateTokens;
