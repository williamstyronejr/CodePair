const Solution = require('../models/solution');

/**
 * Creates a new solution.
 * @param {String} challengeId Id of challenge
 * @param {String} challengeName Name of challenge
 * @param {String} code Code for solution
 * @param {Array<String>} users Users who created solution
 * @param {String} language Language the solution was written in
 * @returns {Promise<Object>} Returns a promise to resolve with a new solution
 *  object.
 */
exports.createSolution = (
  challengeId,
  challengeName,
  code,
  users,
  language
) => {
  return Solution({
    challengeId,
    challengeName,
    code,
    users,
    language,
  }).save();
};

/**
 * Finds and returns all the solutions belonging to a user by user's id.
 * @param {String} userId Id of user
 * @param {Number} limit Number of entries to limit in response
 * @param {Number} skip Number of elements to skip
 * @return {Promise<Array<Object>>} Returns a promise to resolve with an array of all
 *  solutions for a given user, or an empty array if non.
 */
exports.findUserSolutions = (
  userId,
  limit = 10,
  skip = 0,
  projection = null
) => {
  return Solution.find({ users: userId }, projection)
    .limit(limit)
    .skip(skip)
    .exec();
};
