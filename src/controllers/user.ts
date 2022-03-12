import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import * as userService from '../services/user';
import ApiError from '../exceptions/ApiErrors';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Entered data is incorrect', errors.array()));
    }

    await userService.signUp(email, password);
    res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Entered data is incorrect', errors.array()));
    }

    const { tokens, user } = await userService.logIn(email, password);
    res.json({ message: 'Logged in successfully', tokens, user });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Provided data is incorrect', errors.array()));
    }

    const tokens = await userService.refresh(refreshToken);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

export const logOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Provided data iss incorrect', errors.array()));
    }

    await userService.logOut(refreshToken);
    res.json({ message: 'logged out successfully' });
  } catch (error) {
    console.log(error);
  }
};

export const activate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { link } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await userService.activate(link);
    res.json({ message: 'Account activated successfully' });
  } catch (error) {
    next(error);
  }
};
