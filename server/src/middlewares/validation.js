const { body, validationResult } = require('express-validator');
const User = require('../models/user');

/**
 * Creates format for validation messages. each message will be in the form of
 *  { [param]: msg }.
 * @param {String} msg Message passed by valdation rules
 * @return {String} Returns just hte message that was passed.
 */
const validationFormat = ({ msg }) => msg;

/**
 * Checks validation rule results. If any errors, response with errors in
 *  json, otherwise call next function.
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function to be called
 */
function checkValdation(req, res, next) {
  const errors = validationResult(req).formatWith(validationFormat);

  if (!errors.isEmpty()) {
    const err = new Error('Valdator caught invalid user inputs');
    err.status = 400;
    err.msg = errors.mapped();
    return next(err);
  }

  // No errors found, call to next
  return next();
}

const userEmailValidation = [
  body('username', 'Invalid username')
    .optional()
    .trim()
    .matches(/^[A-Za-z0-9_]+$/) // letters a - z, numbers, and _
    .withMessage('Please only use letters (a-z), numbers, and underscores(_).')
    .isLength({ min: 4, max: 16 })
    .withMessage('Username must be between 4 and 16 characters.')
    .custom((value) =>
      User.findOne({ username: value }).then((user) => {
        if (user) throw new Error('Username is already taken.');
      })
    ),
  body('email', 'Invalid email.')
    .optional()
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail()
    .custom((value) =>
      User.findOne({ email: value }).then((user) => {
        if (user) throw new Error('Email is already in use');
      })
    ),
];

/**
 * Validation rules to be used for password fields.
 *  Password must exist and have at least 4 characters.
 * @param {String} fieldName Name of password field (Used for newPassword)
 * @returns {Array} Returns an array containing validation rules.
 */
const passwordValidation = (fieldName = 'password') => [
  body(fieldName, 'Invalid password')
    .exists()
    .withMessage('Must provide password.')
    .isLength({ min: 4 })
    .withMessage('Password must be between 4.'),
];

/**
 * Validation rules to be used for username.
 *  Username must exist, contain only letters, numbers, and underscore, be
 *  between 4 and 16 characters, and can not already be in use.
 * @param {String} fieldName Name of username field
 * @returns {Array} Returns an array containing validation rules.
 */
const usernameValidation = (fieldName = 'username') => [
  body(fieldName, 'Invalid username')
    .exists()
    .withMessage('Must provide username')
    .trim()
    .matches(/^[A-Za-z0-9_]+$/) // letters a - z, numbers, and _
    .withMessage('Please only use letters (a-z), numbers, and underscores(_).')
    .isLength({ min: 4, max: 16 })
    .withMessage('Username must be between 4 and 16 characters.')
    .custom((value) =>
      User.findOne({ username: value }).then((user) => {
        if (user) throw new Error('Username is already taken.');
      })
    ),
];

/**
 * Validation rules for user email.
 *  Email must exist, be an email addresss, and is not already in use.
 * @param {String} fieldName Name of email field
 * @return {Array} Returns an array containing validation rules.
 */
const emailValidation = (fieldName = 'email') => [
  body(fieldName, 'Invalid email.')
    .exists()
    .withMessage('Must provide email.')
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail()
    .custom((value) =>
      User.findOne({ email: value }).then((user) => {
        if (user) throw new Error('Email is already in use');
      })
    ),
];

exports.validateInputs = [...userEmailValidation, checkValdation];

/**
 * Validation rules for local user signup
 */
exports.validateSignup = [
  ...usernameValidation(),
  ...passwordValidation(),
  ...emailValidation(),
  checkValdation,
];

/**
 * Validation rules for updating settings. Only requires that
 *  a password is supplied, everything else is optional.
 */
exports.validateSettingsUpdate = [
  body('username', 'Invalid username name')
    .optional()
    .trim()
    .matches(/^[A-Za-z0-9_]+$/) // letters a - z, numbers, and _
    .withMessage('Please only use letters (a-z), numbers, and underscores(_).')
    .isLength({ min: 4, max: 16 })
    .withMessage('Username must be between 4 and 16 characters.')
    .custom((value) =>
      User.findOne({ username: value }).then((user) => {
        if (user) throw new Error('Username is already taken.');
      })
    ),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email.')
    .normalizeEmail()
    .custom((value) =>
      User.findOne({ email: value }).then((user) => {
        if (user) throw new Error('Email is already in use');
      })
    ),
  checkValdation,
];

/**
 * Validation rules for updating current user's password
 */
exports.validatePasswordUpdate = [
  ...passwordValidation(),
  ...passwordValidation('newPassword'),
  checkValdation,
];

/**
 * Validation rules for resetting a password.
 */
exports.validatePasswordReset = [
  ...passwordValidation(),
  body('passwordC')
    .exists()
    .withMessage('Must confirm new password.')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do no match.'),
  checkValdation,
];

/**
 * Validation rules for testing code. Checks if both code and language is
 *  provided.
 */
exports.validateCodeTest = [
  body('code').exists().withMessage('Code must be provided to run test'),
  body('language').exists().withMessage('A language must be provided.'),
  checkValdation,
];
