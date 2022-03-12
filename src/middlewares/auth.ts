import { NextFunction, Request, Response } from 'express';
import ApiError from '../exceptions/ApiErrors';

const { verifyAccess } = require('../services/token');

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.get('Authorization');
  if (!headerToken) {
    return next(ApiError.UnauthorizedError());
  }
  const token = headerToken.split(' ')[1];
  const verified = verifyAccess(token);

  if (verified.type !== 'access') {
    return next(ApiError.UnauthorizedError());
  }

  req.body.userId = verified.userId;
  next();
};

export default authMiddleware;
