const { Router } = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');

const router = Router();

router.post('/signup',
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

router.post('/login', [
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

router.post('/refreshToken', userController.refresh);

router.post('/logout', userController.logOut);

router.post('/resetPassword', () => {
});

module.exports = router;
