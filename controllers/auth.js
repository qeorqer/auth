const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Token = require('../models/token');
const updateTokens = require('../utils/auth');

module.exports.signUp = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User signed up successfully', user });
  } catch (error) {
    console.log(error);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Entered credentials are invalid' });
    }

    const tokens = await updateTokens(user._id);
    res.json({ message: 'Logged in successfully', tokens });
  } catch (error) {
    console.log(error);
  }
};

module.exports.refresh = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (payload.type !== 'refresh') {
      return res.status(401).json({ message: 'unauthorized' });
    }

    const token = await Token.findOne({ tokenId: payload.id });

    if (token === null) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const tokens = await updateTokens(token.userId, token.tokenId, true);
    res.json(tokens);
  } catch (error) {
   console.log(error);
  }
};
