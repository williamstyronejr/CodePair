const {
  findUserByUsername,
  findUserByEmail,
  updateUserPassword,
  updateUser,
} = require('../services/user');
const {
  generateToken,
  findTokenById,
  deleteToken,
} = require('../services/resetToken');
const { sendEmailTemplate } = require('../services/emailer');

const { IP, PORT, DOMAIN } = process.env;
const siteDomain = DOMAIN || `${IP}:${PORT}`;

/**
 * Route handler for getting logged in user's data. Current response with
 *  all user data.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.getCurrentUserData = (req, res, next) => {
  res.json({
    id: req.user.id,
    displayName: req.user.displayName,
    email: req.user.email,
    profileImage: req.user.profileImage,
    username: req.user.username,
    verified: req.user.verified,
    oauthUser: !!req.user.githubId,
  });
};

/**
 * Route handler for getting a specific user's data by username. Responses with
 *  user's data if found, otherwise throws error.
 *  user's username, email, and profileImage.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.getUserData = async (req, res, next) => {
  const { user: username } = req.params;

  try {
    const user = await findUserByUsername(username, {
      hash: false,
      __v: false,
    });

    if (!user) {
      const error = new Error(`Username, ${username}, was not found.`);
      error.status = 404;
      throw error;
    }

    res.json({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      profileImage: user.profileImage,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Route handler for updating the current user's settings. Settings include
 *  username, email, and profile image.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.updateUserData = async (req, res, next) => {
  const { username, email } = req.body;
  const { file } = req;

  let params = {};

  if (username) params = { ...params, username };
  if (email) params = { ...params, email };
  if (file) params = { ...params, profileImage: file.filename };

  // Update user's settings
  try {
    await updateUser(req.user._id, params);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

/**
 * Route handler for updating current user's password. Checks that user is not a
 *  github user before attempting pasword change.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.updateUserPassword = async (req, res, next) => {
  const { password, newPassword } = req.body;

  // Check if user is Oauth
  if (req.user.githubId) {
    const err = new Error(
      `OAuth user attempt to change password, ${req.user._id}`
    );
    err.status = 400;
    err.msg = 'Oauth user can not change their password.';
    return next(err);
  }

  // Check password against current user's password
  try {
    const valid = await req.user.comparePassword(password);

    if (!valid) {
      const error = new Error(
        'Incorrect current password when updating password.'
      );
      error.msg = { password: 'Incorrect password' };
      error.status = 400;
      throw error;
    }

    await updateUserPassword(req.user._id, newPassword);

    res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};

/**
 * Route handler for sending password recovery email to account by
 * username or email. Responses with success even if no user is found,
 *  but will not send a email. Github users will recieve 400 error.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.sendPasswordEmail = async (req, res, next) => {
  const { field } = req.body;

  try {
    const user = await (field.indexOf('@') === -1
      ? findUserByUsername(field)
      : findUserByEmail(field));

    if (!user) return res.json({ success: true });
    if (user.githubId) {
      const error = new Error(
        `Attempt password recovery for github user, ${user.id}`
      );
      error.status = 400;
      throw error;
    }

    const { id: tokenId, token } = await generateToken(user.id);

    // Send URL to user's email
    sendEmailTemplate(
      user.email,
      'Password Recovery',
      'password_recovery.html',
      {
        username: user.username,
        link: `${siteDomain}/account/reset/password?id=${tokenId}&token=${token}`,
      },
      (mailErr) => {
        if (mailErr) throw new Error('Could not send email');
        return res.json({ success: true });
      }
    );
  } catch (err) {
    return next(err);
  }
};

/**
 * Route handler for reseting user's password. Responses with an error message
 * if token is invalid (expired or doesn't exist). Will delete token if used.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.passwordReset = async (req, res, next) => {
  const { id, token } = req.query;
  const { password } = req.body;

  try {
    const resetToken = await findTokenById(id);
    if (!resetToken) {
      const err = new Error('Invalid token');
      err.status = 400;
      return next(err);
    }

    const validToken = await resetToken.compareToken(token);

    if (!validToken) {
      const err = new Error('Invalid token');
      err.status = 400;
      return next(err);
    }

    // Delete the token and update user's password

    await Promise.all([
      deleteToken(id),
      updateUserPassword(resetToken.userId, password),
    ]);

    res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};
