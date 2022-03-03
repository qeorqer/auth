const { model, Schema } = require('mongoose');

const Token = new Schema({
  tokenId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  expireAt: {
    type: Date,
    default: new Date(),
    expires: 60 * 60 * 24 * 30,
  },
});

module.exports = model('Token', Token);
