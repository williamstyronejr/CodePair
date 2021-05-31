const { promisify } = require('util');
const redis = require('redis');
const logger = require('./logger');

let redisClient;
const activeQueue = {};

/**
 * List of queues that have users in them.
 */
exports.activeQueue = activeQueue;

// Promisify multi and Exec
const mProto = redis.Multi.prototype;
mProto.exec_transaction = promisify(mProto.exec_transaction);
mProto.exec = mProto.exec_transaction;
mProto.EXEC = mProto.exec;

/**
 * Creates and connects client to redis server. Will reject with an error if the
 *  redis client can not connect or is wrong version.
 * @param {String} IP IP/host for redis server
 * @param {Number} PORT Port for redis server
 * @param {String} URL Redis url connection string
 * @return {Promise<Object>} A promise to resolve with teh redis client, or reject with an
 *  error if redis client can not connect.
 */
exports.setupRedis = (IP = 'localhost', PORT = 6379, URL = null) => {
  redisClient = URL ? redis.createClient(URL) : redis.createClient(PORT, IP);

  return new Promise((res, rej) => {
    // Set up event logs for non-production environments
    if (process.env.NODE_ENV === 'dev') {
      redisClient.on('error', (err) => {
        rej(err);
      });

      redisClient.on('disconnect', () => {
        logger.info('Redis server disconnected.');
      });
    }

    // On ready, determine if redis server is the correct version
    redisClient.on('ready', () => {
      logger.info(`Connected to redis server ${IP}:${PORT}`);
      // Requires redis client to be version 5
      if (redisClient.server_info.versions[0] < 5) {
        return rej(new Error('Requires redis version >= 5.'));
      }

      return res(redisClient);
    });

    // Promisify redis client functions
    // redisClient.watch = promisify(redisClient.watch);
    redisClient.zcard = promisify(redisClient.zcard);
    redisClient.zadd = promisify(redisClient.zadd);
    redisClient.zrem = promisify(redisClient.zrem);
    redisClient.zrange = promisify(redisClient.zrange);
    redisClient.zremrangebyrank = promisify(redisClient.zremrangebyrank);
    redisClient.zpopmin = promisify(redisClient.zpopmin);
    redisClient.hexists = promisify(redisClient.hexists);
    redisClient.hmset = promisify(redisClient.hmset);
    redisClient.hgetall = promisify(redisClient.hgetall);
    redisClient.del = promisify(redisClient.del);
    redisClient.expire = promisify(redisClient.expire);
    redisClient.flushall = promisify(redisClient.flushall);
  });
};

/**
 * Close connection to redis
 */
exports.closeRedis = () => {
  redisClient.quit();
};

/**
 * Adds a user to a specific queue.
 * @param {String} queueId Id of queue to add user to
 * @param {String} userId Id of user to add to queue
 * @param {Number} matchCount Number of users required to form a match
 * @return {Promise} A promise to resolve when user has been added into queue.
 */
exports.addUserToQueue = (queueId, userId, matchCount = 2) => {
  // Prevents unneeded calls to redis server
  if (queueId == null || userId == null || queueId === '' || userId === '') {
    return null;
  }

  activeQueue[queueId] = matchCount;
  return redisClient.zadd(queueId, Date.now(), userId);
};

/**
 * Removes a user from a specific queue.
 * @param {String} queueId Id of queue to remove user from
 * @param {String} userId Id of user to remove
 * @return {Promise<Number>} A promise to resolve with the number of users removed. If
 *  a user is removed, will return 0.
 */
exports.removeUserFromQueue = (queueId, userId) => {
  return redisClient.zrem(queueId, userId);
};

/**
 * Gets the number of users in a specific queue.
 * @param {String} queueId Id of queue to get size of
 * @return {Promise<Number>} A promise to resolve with number members in queue.
 */
exports.getQueueSize = (queueId) => {
  return redisClient.zcard(queueId);
};

/**
 * Pops users from a specific queue only if there are enough users in that queue.
 * @param {String} queueId Id of queue to pop users from
 * @param {Number} numToPop Number of users to pop
 * @return {Promise<Array>} A promise to resolve with an array of user if any
 *  were in the queue.
 */
exports.popUsersFromQueue = async (queueId, numToPop = 2) => {
  if (numToPop < 1) return []; // Quick check to prevent useless redis calls

  await redisClient.watch(queueId);
  const size = await redisClient.zcard(queueId);
  if (size < numToPop) return [];

  return redisClient.zpopmin(queueId, numToPop).then((res) => {
    return res.filter((value, index) => index % 2 === 0);
  });
};

/**
 * Creates a pending queue and stores provided users. Pending queue in form of
 *  hash with userId as key and true/false as a value to indicate whether a
 *  user has accepted. Queue's key set to expires in 12 seconds of creation.
 * @param {String} queueId Id of queue to add users to
 * @param {Array<String>} userIds Array of user ids to add to pending queue
 * @return {Promise<String>} A Promise to resolve with a string if sucessful,
 *  or null if no queue was created.
 */
exports.addUsersToPendingQueue = async (queueId, userIds) => {
  // Quick check to prevent unneeded calls
  if (!userIds || !queueId || queueId === '' || userIds.length < 1) {
    return null;
  }

  // Adds 'false' after every element to store in hash.
  const args = userIds.reduce((r, a) => r.concat(a, 'false'), []);
  await redisClient.hmset(queueId, args);
  return redisClient.expire(queueId, 12); // Expire key after 12 seconds
};

/**
 * Marks a user as having accepted the pending queue and checks if all users
 *  have accepted. When all users have accepted, returns an array of users
 *  that are ready for a room.
 * @param {String} queueId Id of queue to mark user in
 * @param {String} userId Id of user to mark as accepted
 * @return {Promise<Array>} A promise to resolve with an array of userIds if
 *  all users have accepted, otherwise with null.
 */
exports.markUserAsAccepted = async (queueId, userId) => {
  if (queueId == null || userId == null) return false; // Quick parameter check

  // Only try to mark user if they exist in the queue
  const userExists = await redisClient.hexists(queueId, userId);

  if (userExists) {
    let results;

    // Loop in case of multi fails
    while (!results) {
      // eslint-disable-next-line no-await-in-loop
      results = await redisClient
        .multi()
        .hmset(queueId, userId, 'true')
        .hgetall(queueId)
        .exec();
    }

    // Check if a user is still not ready
    if (Object.values(results[1]).includes('false')) {
      return null;
    }

    return Object.keys(results[1]);
  }

  return null;
};

/**
 * Gets all elements of a pending queue.
 * @param {String} queueId Id of queue to get elements from.
 * @return {Promise<Array>} A promise to resolve with an array of strings
 *  from the queue.
 */
exports.getPendingQueue = (queueId) => {
  return redisClient.hgetall(queueId);
};

/**
 * Deletes a queue from redis.
 * @param {String} queueId Id of queue to delete
 * @return {Promise<Number>} A promise to resolve when the request is complete
 *  and return 1 if the queue was removed or 0 if no queue was found.
 */
exports.removePendingQueue = (queueId) => {
  return redisClient.del(queueId);
};
