import UUID from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import Token from '../models/token';
import { updateTokens, updateTokensReturnType } from './token';
import { sendActivationMail } from './mail';
import ApiError from '../exceptions/ApiErrors';
import { userType } from '../types/types';

export const signUp = async (email: string, password: string): Promise<void> => {
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

type loginReturnType = {
  tokens: updateTokensReturnType
  user: userType
}

export const logIn = async (email: string, password: string): Promise<loginReturnType> => {
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

export const refresh = async (refreshToken: string) => {
  const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
  // @ts-ignore
  if (verifiedToken.type !== 'refresh') {
    throw ApiError.UnauthorizedError();
    throw new Error('');
  }

  // @ts-ignore
  const token = await Token.findOne({ tokenId: verifiedToken.id });
  if (token === null) {
    throw ApiError.BadRequest('The token is invalid');
  }

  return await updateTokens(token.userId, token.tokenId, true);
};

export const logOut = async (refreshToken: string) => {
  const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
  // @ts-ignore
  return Token.findOneAndRemove({ tokenId: verifiedToken.id });
};

export const activate = async (activationLink: string) => {
  const user = await User.findOne({ activationLink });

  if (!user) {
    throw ApiError.BadRequest('Invalid link');
  }

  user.isActivated = true;
  await user.save();
};
