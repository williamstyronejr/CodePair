const mongoose = require('mongoose');

/**
 * Sets-up connection to database.
 * @param {String} uri The connection URI for mongoose
 * @param {Object} options Mongoose options
 * @return {Promise<Void>} A promise to resolve after database connection is made.
 *  Or reject if database is not reached.
 */
module.exports.connectDatabase = (
  uri,
  options = { useNewUrlParser: true, useUnifiedTopology: true }
) => {
  // Setup DB
  return mongoose.connect(uri, options);
};

/**
 * Closes all connections to Database.
 * @return {Promise<Void>} A promise to resolve once mongoose connections are closed
 */
module.exports.disconnectDatabase = () => {
  return mongoose.disconnect();
};
