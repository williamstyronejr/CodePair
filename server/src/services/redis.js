const { createClient } = require('redis');
const logger = require('./logger');

let redisClient;
const activeQueue = {};

const rTest = createClient();
/**
 * List of all active queues that have at least one user in them
 */
exports.activeQueue = activeQueue;

/**
 * Creates and connects client to redis server. Will reject with an error if the
 *  redis client can not connect or if redis version isn't >= 5 (need ZPOPMIN).
 * @param {String} url Host or url for redis server.
 * @param {Number} port Port for redis server
 * @param {String} password Redis password
 * @return {Promise<Object>} A promise to resolve with teh redis client, or reject with an
 *  error if redis client can not connect.
 */
exports.setupRedis = async (host, port, url = null) => {
  redisClient =
    url === null
      ? createClient({ host, port })
      : createClient({
          socket: {
            tls: false,
          },
          url,
        });

  await redisClient.connect();
  await redisClient.ping();

  logger.info(
    `Connected to redis server ${url === null ? `${host}:${port}` : url}`
  );

  redisClient.on('error', (err) => {
    throw err;
  });
  // if (redisClient.server_info.versions[0] < 5)
  //   throw new Error('Requires redis verison >= 5');
  return redisClient;
};

/**
 * Close connection to redis
 */
exports.closeRedis = () => {
  redisClient.quit();
};

/**
 * Adds a user to a specific challenge queue using the current time as the
 *  score, and adds queueId to active queues.
 * @param {String} queueId Id of queue to add user to
 * @param {String} userId Id of user to add to queue
 * @param {Number} userCount Number of users required to form a match
 * @return {Promise<Number|null>} A promise to resolve with number of users
 *  added or null if no user was added.
 */
exports.addUserToQueue = (queueId, userId, userCount = 2) => {
  if (queueId == null || userId == null || queueId === '' || userId === '') {
    return null;
  }

  activeQueue[queueId] = userCount;

  return redisClient.zAdd(queueId, { score: Date.now(), value: userId });
};

/**
 * Removes a user from a specific queue.
 * @param {String} queueId Id of queue to remove user from
 * @param {String} userId Id of user to remove
 * @return {Promise<Number>} A promise to resolve with the number of users
 *  removed. If no user is removed, will resolve with 0.
 */
exports.removeUserFromQueue = (queueId, userId) => {
  return redisClient.zRem(queueId, userId);
};

/**
 * Gets the number of users in a specific queue.
 * @param {String} queueId Id of queue to get size of
 * @return {Promise<Number>} A promise to resolve with number members in queue.
 */
exports.getQueueSize = (queueId) => {
  return redisClient.zCard(queueId);
};

/**
 * Pops users from a specific queue only if there are enough users in that queue.
 * @param {String} queueId Id of queue to pop users from
 * @param {Number} numToPop Number of users to pop
 * @return {Promise<Array|Null>} A promise to resolve with an array of user ids
 *  or an empty array if not enough users exists. Resolves with null if error
 *  occurs during redis operations.
 */
exports.popUsersFromQueue = async (queueId, numToPop = 2) => {
  if (numToPop < 1) return [];

  const res = await redisClient.executeIsolated(async (client) => {
    try {
      await client.watch(queueId);

      const size = await client.zCard(queueId);
      if (size < numToPop) {
        client.unwatch();
        return [];
      }

      return client.multi().zPopMinCount(queueId, numToPop).exec();
    } catch (err) {
      return null;
    }
  });

  if (!res) return null;
  if (res.length === 0) return [];

  // Removes the scores from list and leaves the userIds
  return res[0].map((elem) => elem.value);
};

/**
 * Creates a pending queue and stores provided users and challenge id. Pending
 *  queue in form of hash with userId as key and true/false as a value to
 *  indicate whether a user has accepted. Queue's key set to expires in 12
 *  seconds of creation.
 * @param {String} queueId Id of queue to add users to
 * @param {Array<String>} userIds Array of user ids to add to pending queue
 * @param {String} challengeId Id of challenge for room
 * @return {Promise<String>} A Promise to resolve with a string if sucessful,
 *  or null if no queue was created.
 */
exports.addUsersToPendingQueue = async (queueId, userIds, challengeId) => {
  if (!userIds || !queueId || queueId === '' || userIds.length < 1) return null;

  // Adds 'false' after each userId as a ready flag
  const args = userIds.reduce(
    (r, a) => r.concat(a, 'false'),
    ['challengeId', challengeId]
  );
  await redisClient.hSet(queueId, args);
  return redisClient.expire(queueId, 12);
};

/**
 * Marks a user as having accepted the pending queue and checks if all users
 *  have accepted. When all users have accepted, returns an object containing
 *  user ids and challenge id as keys.
 * @param {String} queueId Id of queue to mark user in
 * @param {String} userId Id of user to mark as accepted
 * @return {Promise<Object|null>} A promise to resolve with an object with userIds
 *  and challengeId as keys, otherwise with null.
 */
exports.markUserAsAccepted = async (queueId, userId) => {
  if (queueId == null || userId == null) return false;

  // Only try to mark user if they exist in the queue
  const userExists = await redisClient.hExists(queueId, userId);

  if (userExists) {
    let results;

    // Loop in case of multi fails
    while (!results) {
      // eslint-disable-next-line no-await-in-loop
      results = await redisClient
        .multi()
        .hSet(queueId, userId, 'true')
        .hGetAll(queueId)
        .exec();
    }

    // If pending queue has a user with false flag, match is not ready
    if (Object.values(results[1]).includes('false')) return null;

    return results[1];
  }

  return null;
};

/**
 * Gets all elements of a pending queue.
 * @param {String} queueId Id of queue to get elements from
 * @return {Promise<Object<string, string>>} A promise to resolve with the
 *  object for the pending queue. If queue doesn't exist, an empty object is
 *  returned.
 */
exports.getPendingQueue = (queueId) => {
  return redisClient.hGetAll(queueId);
};

/**
 * Deletes a pending queue from redis.
 * @param {String} queueId Id of queue to delete
 * @return {Promise<Number>} A promise to resolve when the request is complete
 *  returning 1 if the queue was removed or 0 if no queue was found.
 */
exports.removePendingQueue = (queueId) => {
  return redisClient.del(queueId);
};
