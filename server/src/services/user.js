const bcrypt = require('bcrypt');
const User = require('../models/user');

/**
 * Generates a salt and creates a hash from the password provided using
 *  bcrypt's genSalt and hash functions.
 * @param {String} password The password to hash
 * @return {Promise<String>} A promise to resolve with the update
 */
function hashPassword(password) {
  return bcrypt
    .genSalt(13)
    .then((salt) => bcrypt.hash(password, salt).then((hash) => hash));
}

/**
 * Searchs DB for users based on given params.
 * @param {Object} params The search parameters for users.
 * @return {Promise<OBject>} Returns a promise to resolve with a user object if
 *  found, otherwise.
 */
exports.findUsers = (params) => {
  return User.find(params).exec();
};

/**
 * Finds and returns a user by it's username.
 * @param {String} username The username of the user to search for
 * @param {Object} projection Object containg fields to include/exclude
 * @return {Promise<Object>} A promise to resolve with a user object of null if no
 *  user is found.
 */
exports.findUserByUsername = (username, projection = null) => {
  return User.findOne({ username }, projection).exec();
};

/**
 * Finds and returns a user by it's email.
 * @param {String} email Email of user to serach for
 * @return {Promise<Object>} A promise to resolve with a user object of null if no
 *  user is found.
 */
exports.findUserByEmail = (email, projection) => {
  return User.findOne({ email }, projection).exec();
};

/**
 * Hashes provided password and then updates user wiht the new hash.
 * @param {String} id Id of user to update
 * @param {String} password Non-hashed password
 * @param {Object} options Query options
 * @return {Promise<Object>} A promise to resolve with the user object
 *  (not updated).
 */
exports.updateUserPassword = (id, password, options = {}) => {
  return hashPassword(password).then((hash) =>
    User.findByIdAndUpdate(id, { hash }, options).exec()
  );
};

/**
 * Hashes the provided password and uses all parameters to create a new user.
 * @param {String} username A username
 * @param {String} email An email
 * @param {String} password A unhashed password
 * @param {String} profileImage Filename for a profile image.
 * @return {Promise<Object>} A promise resolve with the new user object.
 */
exports.createUser = (
  username,
  email,
  password,
  profileImage = 'default.jpg'
) => {
  return hashPassword(password).then((hash) => {
    return User({
      username,
      displayName: username,
      email,
      hash,
      profileImage,
    }).save();
  });
};

/**
 * Searchs for any users that have the provided username and/or email.
 * @param {String} username Username to search for
 * @param {String} email email to search for
 * @return {Promise<Array>} A promise to resolve with an array of users that
 *  have the provided username and/or email. If no user is found resolves with
 *  an empty array.
 */
exports.usernameEmailAvailability = (username, email) => {
  return User.findOne({
    $or: [
      {
        username,
        email,
      },
    ],
  }).exec();
};

/**
 * Updates users data with provided params. Use only if no direct function
 *  exists.
 * @param {String} id Id of user to update
 * @param {Object} params Object containing fields + values
 * @param {Object} options Query options
 * @return {Promise<Object>} A promise to resolve with the user object
 *  (not updated).
 */
exports.updateUser = (id, params, options = {}) => {
  return User.findByIdAndUpdate(id, params, options).exec();
};
