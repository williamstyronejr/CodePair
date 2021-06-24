const schedule = require('node-schedule');
const logger = require('./logger');
const { checkActiveQueues } = require('./challengeQueue');
const { deleteCompletedRooms, expireOldRooms } = require('./room');

const { SERVER_INSTANCE_CID } = process.env;
let schedulerQueue; // Job scheduler for queue challenges
let schedulerRoom; // Job scheduler for room clean up
let schedulerRoomExpire; // Job scheduler for marking rooms as completed after 24 hours

/**
 * Sets up a scheduled job to run every 5 sceonds to check for active queues.
 */
exports.setUpChallengeQueue = () => {
  if (SERVER_INSTANCE_CID === '0' || SERVER_INSTANCE_CID === undefined) {
    schedulerQueue = schedule.scheduleJob('*/5 * * * * *', checkActiveQueues);
  }
};

/**
 * Sets up a scheduled job to remove rooms that are marked completed once a day.
 */
exports.setUpRoomDeletion = () => {
  //
  if (SERVER_INSTANCE_CID === '0' || SERVER_INSTANCE_CID === undefined) {
    schedulerRoom = schedule.scheduleJob('00 00 00 * * *', async () => {
      try {
        const results = await deleteCompletedRooms();
        logger.info();
      } catch (err) {
        logger.error(err.stack);
      }
    });
  }
};

/**
 * Sets up a scheduled job to mark all rooms older than a days as completed in
 *  order to clear up database.
 */
exports.setUpRoomCleanUp = () => {
  if (SERVER_INSTANCE_CID === '0' || SERVER_INSTANCE_CID === undefined) {
    schedulerRoomExpire = schedule.scheduleJob('00 00 00 * * *', async () => {
      try {
        const dayAhead = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const results = await expireOldRooms(dayAhead);
        logger.info(`${results.nModified} room were marked completed.`);
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
