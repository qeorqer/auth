const { model, Schema } = require('mongoose');

const Token = new Schema({
  tokenId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Token', Token);
