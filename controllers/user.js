const jwt = require('jsonwebtoken');

const Token = require('../models/token');
const updateTokens = require('../utils/auth');
const authService = require('../services/user');

module.exports.signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = authService.signUp(email, password);
    res.status(201).json({ message: 'User signed up successfully', user });
  } catch (error) {
    console.log(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { tokens, user } = await authService.logIn(email, password);
    res.json({ message: 'Logged in successfully', tokens, user });
  } catch (error) {
    console.log(error);
  }
};

module.exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;


    res.json(tokens);
  } catch (error) {
    console.log(error);
  }
};
