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
  validatePagination,
} = require('../middlewares/validation');
const {
  getUserData,
  getCurrentUserData,
  updateUserData,
  updateUserPassword,
  sendPasswordEmail,
  passwordReset,
  getUserProfileStats,
  getUserSolutions,
} = require('../controllers/user');
const { profileUpload } = require('./utils');

const jsonParser = bodyParser.json();

// Auth routes for signin/signup
router.post('/api/signup', jsonParser, validateSignup, localSignup);

router.post('/api/signin', jsonParser, requireLocalSignin, localSignin);

router.post('/api/signout', signout);

// Route for registering a github user
router.post(
  '/api/account/register',
  jsonParser,
  requireAuth,
  validateInputs,
  registerGithubUser
);

// Route for checking if username or email is in use
router.post('/api/inputvalidator', jsonParser, validateInputs, verifyInputs);

// Routes for github auth
router.get('/auth/github', requireGitSignin, (req, res) => {});
router.get('/auth/github/callback', verifyGitSignin);

// Route for getting user data
router.get('/api/user/:user/data', getUserData);
router.get('/api/user/data', requireAuth, getCurrentUserData);
router.get('/api/user/:username/profile/stats', getUserProfileStats);
router.get(
  '/api/user/:username/profile/solutions',
  validatePagination,
  getUserSolutions
);

// Routes for updating/reseting user data
router.post(
  '/api/settings/account',
  profileUpload,
  validateSettingsUpdate,
  requireAuth,
  updateUserData
);

router.post(
  '/api/settings/password',
  jsonParser,
  validatePasswordUpdate,
  requireAuth,
  updateUserPassword
);

router.post('/api/account/recovery/password', jsonParser, sendPasswordEmail);

router.post(
  '/api/account/reset/password',
  jsonParser,
  validatePasswordReset,
  passwordReset
);

module.exports = router;
