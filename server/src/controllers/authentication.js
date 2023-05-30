const passport = require('passport');
const jwt = require('jsonwebtoken');
const { createUser, updateUser } = require('../services/user');

const { JWT_SECRET } = process.env;

/**
 * Creates a Jwt for a given user object using jsonwebtoken.
 * @param {Object} user User object from database
 * @return {String} Returns a JWT for given user.
 */
function createJwt(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, JWT_SECRET, {});
}

/**
 * Route handler for local signup. On successful user creation, a JWT will be
 *  set in cookie and responses with a success message.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.localSignup = async (req, res, next) => {
  const { email, username, password } = req.body;

  try {
    const user = await createUser(username, email, password);

    res.cookie('token', createJwt(user));
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        profileImage: `/img/${user.profileImage}`,
      },
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Router handler for signing in using local signin. Sets cookie for user and
 *  response with session user data.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.localSignin = (req, res, next) => {
  res.cookie('token', createJwt(req.user));

  res.json({
    success: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      displayName: req.user.displayName,
      email: req.user.email,
      profileImage: req.user.profileImage.includes('https://')
        ? req.user.profileImage
        : `/img/${req.user.profileImage}`,
    },
  });
};

/**
 * Router handler for signing a user out by destroying the user's cookie
 *  and redirecting them to the root route.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.signout = (req, res, next) => {
  res.cookie('token', '', { expires: new Date(0) });
  res.json({ success: true });
};

/**
 * Router handler for input validation. Validation checks are handled by prior
 *  middleware and only makes it here if passed, which just response with
 *  success message.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.verifyInputs = async (req, res, next) => {
  return res.json({ success: true });
};

/**
 * Route handler for github auth callback. Redirects back to the signin with
 *  error query if access was denied.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.verifyGitSignin = (req, res, next) => {
  const { error } = req.query;
  if (error) return res.redirect('/signin?github=error');

  passport.authenticate(
    'github',
    { session: false, scope: ['user:email'], failureRedirect: '/login' },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.json({ error: 'Invalid' });

      const token = createJwt(user);

      // Store token into cookie and redirect user to github verify account
      res.cookie('token', token, {});
      return res.redirect('/challenges');
    }
  )(req, res, next);
};

/**
 * Route handler for registering github user accounts by setting the user's
 *  username.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.registerGithubUser = async (req, res, next) => {
  // If account is not from github, throw error
  if (!req.user || !req.user.githubId) {
    const err = new Error(
      'Attempt to set username through github register for local user'
    );
    err.status = 401;
    return next(err);
  }

  const { username } = req.body;

  try {
    // Update user with new username and mark as verified
    const user = await updateUser(
      req.user.id,
      { username, displayName: username, verified: true },
      { new: true }
    );

    res.send({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        profileImage: user.profileImage,
        oauthUser: true, // Flag used for client
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware for authenticating a user with local login (username/password)
 */
exports.requireLocalSignin = passport.authenticate('local', { session: false });

/**
 * Middleware for authenticating a user with github login
 */
exports.requireGitSignin = passport.authenticate('github', {
  session: false,
  scope: ['user:email'],
});

/**
 * Middleware to require user to have a valid Jwt to access route
 */
exports.requireAuth = passport.authenticate('jwt', { session: false });
