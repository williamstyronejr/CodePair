/**
 * Generates a random string using Math random.
 * @param {Number} length Length of the string to be created
 * @param {String} append String to be append to random string (Ignores length)
 * @return {String} Returns a random string.
 */
exports.createRandomString = (length, append = '') => {
  let s = '';
  do {
    s += Math.random().toString(36).substr(2);
  } while (s.length < length);
  s = s.substring(0, length);

  return s.concat(append);
};

/**
 * Creates a key for a pending match in redis. Key will always end with
 *  "-(queueid)".
 * @param {String} queueId Id of match queue to create pending key for
 * @returns {String} Returns a random string to be used as pendingKey for redis.
 */
exports.createPendingKey = (queueId) => {
  return `${this.createRandomString(12)}-${queueId}`;
};
