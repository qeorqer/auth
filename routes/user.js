const { Router } = require('express');

const userController = require('../controllers/user');

const router = Router();

router.post('/signup', userController.signUp);

router.post('/login', userController.login);

router.post('/refreshToken', userController.refresh);

router.post('/logout', userController.logOut);

router.post('/resetPassword', () => {});

module.exports = router;
