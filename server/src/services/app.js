const path = require('path');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const logger = require('./logger');
const RootRouter = require('../routes/index');
require('./passport'); // Sets up strategies for passport

const app = express();

// Setup middleware
app.use(morgan('combined', { stream: logger.stream }));
app.use(cookieParser());

// Setup routes
app.use(passport.initialize());

// Static route to handle images
app.use('/img', express.static(path.join(__dirname, '..', 'public', 'images')));

// Handle static files for React Client
app.use(
  '/static',
  express.static(
    path.join(__dirname, '..', '..', '..', 'client', 'dist', 'static')
  )
);

app.use(
  '/assets',
  express.static(
    path.join(__dirname, '..', '..', '..', 'client', 'dist', 'assets')
  )
);

RootRouter(app);

// Error handler
app.use((err, req, res, next) => {
  if (err) {
    logger.error(err);

    switch (err.status) {
      case 400: // Parameter/input error
        res.status(err.status).json({ errors: err.msg });
        break;

      case 401: // User not authorized
        res.status(err.status).send();
        break;

      case 403: // Redirect
        err.to ? res.redirect(err.to) : res.status(err.status).send(err.msg);
        break;

      case 404: // Missing page
        res.status(err.status).send();
        break;

      case 422: // Invalid input
        res.status(err.status).json({ errors: err.msg });
        break;

      default:
        res
          .status(500)
          .send('An error has occurred on the server, please try again.');
    }

    return;
  }

  logger.error(new Error('Error handler reached without error.'));
  res
    .status(err.status || 500)
    .send(err.msg || 'An error has occurred on the server, please try again.');
});

module.exports = app;
