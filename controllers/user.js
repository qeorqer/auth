const { validationResult } = require('express-validator');

const userService = require('../services/user');

module.exports.signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = userService.signUp(email, password);
    res.status(201).json({ message: 'User signed up successfully', user });
  } catch (error) {
    console.log(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tokens, user } = await userService.logIn(email, password);
    res.json({ message: 'Logged in successfully', tokens, user });
  } catch (error) {
    console.log(error);
  }
};

module.exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tokens = await userService.refresh(refreshToken);
    res.json(tokens);
  } catch (error) {
    console.log(error);
  }
};

module.exports.logOut = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await userService.logOut(refreshToken);
    res.json({message: 'logged out successfully'});
  } catch (error) {
    console.log(error);
  }
};
