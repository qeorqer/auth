const { Router } = require('express');
const { body, param } = require('express-validator');

const userController = require('../controllers/user');

const router = Router();

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email is incorrect')
      .normalizeEmail()
      .trim(),
    body('password')
      .isLength({ min: 6 })
      .trim()
      .withMessage('Password must contain at least 5 symbols'),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match');
        }
        return true;
      }),
  ],
  userController.signUp,
);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Email is incorrect')
      .normalizeEmail()
      .trim(),
    body('password')
      .isLength({ min: 6 })
      .trim()
      .withMessage('Password must contain at least 5 symbols'),
  ],
  userController.login);

router.post(
  '/refreshToken',
  body('refreshToken')
    .isString()
    .trim()
    .withMessage('Refresh token is required'),
  userController.refresh,
);

router.post(
  '/logout',
  body('refreshToken')
    .isString()
    .trim()
    .withMessage('Refresh token is required'),
  userController.logOut,
);

router.get(
  '/activate/:link',
  param('link')
    .isString()
    .trim(),
  userController.activate,
);

router.post('/resetPassword', () => {
});

module.exports = router;
