const crypto = require('crypto');
const logger = require('./logger');
const {
  activeQueue,
  popUsersFromQueue,
  addUsersToPendingQueue,
} = require('./redis');
const { emitMessageToUserId } = require('./socket');
const { createPendingKey } = require('../utils/utils');

let inProgress = false; // Flag to prevent running queue parallel

/**
 * Notifies users through socket that a match was found.
 * @param {String} queueId Id of pending queue
 * @param {Array} users Array of user ids to send the queuePop notification to
 */
function notifyUsers(queueId, users) {
  users.forEach((userId) => {
    emitMessageToUserId('matchFound', userId, queueId);
  });
}

/**
 * Creates matches for a given queue and adds the users into a separate pending
 *  queue. If a queue is determined to not have enough users, it will be
 *  removed from the active queue list.
 * @param {String} queueId Id of challenge queue "challengeId-language"
 * @param {Number} numOfUsers Number of users to match in queue
 * @return {Promise<String>} A promise to resolve with the id of pending queue
 *  if created, otherwise with null.
 */
async function createMatch(queueId, numOfUsers) {
  const challengeId = queueId.split('-')[0]; // In form {ChallengeId}-{Language}

  const users = await popUsersFromQueue(queueId, numOfUsers);

  // Operation was interrupted (Queue may still have enough users)
  if (users === null) return null;

  // Not enough users, remove queueId from active list
  if (users.length === 0) {
    delete activeQueue[queueId];
    return null;
  }

  // Generate unique id for match
  const pendingQueueId = createPendingKey(queueId);

  return addUsersToPendingQueue(pendingQueueId, users, challengeId).then(
    (result) => {
      if (result == null) return null;
      notifyUsers(pendingQueueId, users);
      return pendingQueueId;
    },
  );
}

/**
 * Attempts to form matches with every active queue. Uses a flag to prevent
 *  running queues in parallel.
 * @return {Promise<Array>} A promise to resolve with an array containing either
 *  null or pending queue Id values for each queue listed in activeQueue.
 */
exports.checkActiveQueues = () => {
  if (inProgress) return false;

  inProgress = true;

  const proms = [];

  Object.entries(activeQueue).forEach(([queueId, numOfUsers]) => {
    proms.push(createMatch(queueId, numOfUsers));
  });

  return Promise.all(proms)
    .then((results) => {
      inProgress = false;
      return results;
    })
    .catch((err) => {
      logger.error(err);
    });
};
