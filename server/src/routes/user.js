const router = require('express').Router();
const bodyParser = require('body-parser');
const {
  requireLocalSignin,
  localSignin,
  localSignup,
  signout,
  verifyInputs,
  requireAuth,
  registerGithubUser,
  verifyGitSignin,
  requireGitSignin,
} = require('../controllers/authentication');
const {
  validateSignup,
  validateInputs,
  validateSettingsUpdate,
  validatePasswordUpdate,
  validatePasswordReset,
} = require('../middlewares/validation');
const {
  getUserData,
  getCurrentUserData,
  updateUserData,
  updateUserPassword,
  sendPasswordEmail,
  passwordReset,
} = require('../controllers/user');
const { profileUpload } = require('./utils');

const jsonParser = bodyParser.json();

// Auth routes for signin/signup
router.post('/signup', jsonParser, validateSignup, localSignup);

router.post('/signin', jsonParser, requireLocalSignin, localSignin);

router.post('/signout', signout);

// Route for registering a github user
router.post(
  '/account/register',
  jsonParser,
  requireAuth,
  validateInputs,
  registerGithubUser
);

// Route for checking if username or email is in use
router.post('/inputvalidator', jsonParser, validateInputs, verifyInputs);

// Routes for github auth
router.get('/auth/github', requireGitSignin, (req, res) => {});
router.get('/auth/github/callback', verifyGitSignin);

// Route for getting logged in user data
router.get('/user/:user/data', getUserData);
router.get('/user/data', requireAuth, getCurrentUserData);

// Routes for updating/reseting user data
router.post(
  '/settings/account',
  profileUpload,
  validateSettingsUpdate,
  requireAuth,
  updateUserData
);

router.post(
  '/settings/password',
  jsonParser,
  validatePasswordUpdate,
  requireAuth,
  updateUserPassword
);

router.post('/account/recovery/password', jsonParser, sendPasswordEmail);

router.post(
  '/account/reset/password',
  jsonParser,
  validatePasswordReset,
  passwordReset
);

module.exports = router;
