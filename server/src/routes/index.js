const path = require('path');
const userRouter = require('./user');
const challengeRouter = require('./challenge');

module.exports = function setUpRoutes(app) {
  app.use(userRouter);
  app.use(challengeRouter);

  // Default to react app in build folder
  app.use('/*', (req, res, next) => {
    try {
      res.sendFile(
        path.join(__dirname, '..', '..', '..', 'client', 'dist', 'index.html')
      );
    } catch (err) {
      const error = new Error('Production build missing.');
      error.status = 404;
      next(err);
    }
  });
};
