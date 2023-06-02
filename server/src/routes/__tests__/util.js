const request = require('supertest');

/**
 * Creates and returns a request to create user with provided params.
 * @param {Object} app Express app to test using supertest
 * @param {String} username Username for new user
 * @param {String} email Email for new user
 * @param {String} password Password for new user
 * @return {Promise<Object>} A promise to resolve with a response object.
 */
exports.createUserRoute = (app, username, email, password) => {
  return request(app)
    .post('/api/signup')
    .send({ username, email, password })
    .set('Accept', 'application/json')
    .expect(200);
};

/**
 * Creates and returns a request to log a user in.
 * @param {Object} app Express app to test using supertest
 * @param {String} username Username to use to signin
 * @param {String} password Password to use to signin
 * @param {Number} status Expected status code to receive
 * @return {Promise<Object>} A promise to resolve with a response object.
 */
exports.signinRoute = (app, username, password, status = 200) => {
  return request(app)
    .post('/api/signin')
    .send({ username, password })
    .set('Accept', 'application/json')
    .expect(status);
};
