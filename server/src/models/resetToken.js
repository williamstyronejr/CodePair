const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ResetTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  created: { type: Date, default: Date.now },
});

/**
 * Compares token to the hashed version using bcrypt's compare method.
 * @param {String} token Token to compare with the hash
 * @return {Promise<Boolean>} A boolean indicating if the token is valid.
 */
ResetTokenSchema.methods.compareToken = function compareToken(token) {
  return bcrypt.compare(token, this.token);
};

const ResetToken = mongoose.model('resetToken', ResetTokenSchema);
module.exports = ResetToken;
