const schedule = require('node-schedule');
const logger = require('./logger');
const { checkActiveQueues } = require('./challengeQueue');
const { deleteCompletedRooms } = require('./room');

const { SERVER_INSTANCE_CID } = process.env;
let schedulerQueue; // Job scheduler for queue challenges
let schedulerRoom; // Job scheduler for room clean up

/**
 * Sets up a scheduled job to run every 5 sceonds to check for active queues.
 */
exports.setUpChallengeQueue = () => {
  if (SERVER_INSTANCE_CID === '0') {
    schedulerQueue = schedule.scheduleJob('*/5 * * * * *', checkActiveQueues);
  }
};

/**
 * Sets up a scheduled job to remove rooms that are marked completed once a day.
 */
exports.setUpRoomCleanUp = () => {
  if (SERVER_INSTANCE_CID === '0') {
    schedulerRoom = schedule.scheduleJob('00 00 00 * * *', async () => {
      try {
        const results = await deleteCompletedRooms();
      } catch (err) {
        logger.error(err.stack);
      }
    });
  }
};

/**
 * Stops schedule job for queue.
 */
exports.cancelQueue = () => {
  schedule.cancelJob(schedulerQueue);
};
