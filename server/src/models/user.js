const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String },
  displayName: { type: String },
  hash: { type: String },
  profileImage: { type: String },
  githubId: { type: String }, // Used if github login
  verified: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  completed: { type: Object },
});

/**
 * Comapares plain password to hashed verison to verify using bcrypt's
 *  compare function.
 * @param {String} password The password to compare the hash to
 * @return {Promise<Boolean>} A promise to resolve with a boolean indicating
 *  whether or not the password is valid.
 */
userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.hash);
};

const User = mongoose.model('user', userSchema);
module.exports = User;
