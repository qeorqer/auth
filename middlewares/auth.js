const ApiError = require('../exceptions/ApiErrors');
const { verifyAccess } = require('../services/token');

module.exports = (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return next(ApiError.UnauthorizedError());
  }
  const token = headerToken.split(' ')[1];
  const verified = verifyAccess(token);

  if (verified.type !== 'access') {
    return next(ApiError.UnauthorizedError());
  }

  req.user = verified;
  next();
};
