const { Router } = require('express');

const authController = require('../controllers/auth');

const router = Router();

router.post('/signup', authController.signUp);

router.post('/login', authController.login);

router.post('/refreshToken', authController.refresh);

router.post('/logout', () => {});

router.post('/resetPassword', () => {});

module.exports = router;
