const { emitMessageToRoom } = require('../services/socket');
const { createSolution } = require('../services/solution');
const {
  createRoom,
  findRoom,
  setRoomToJoinable,
  addUserToRoom,
  markRoomCompleted,
  findRoomByInvite,
  saveCodeById,
} = require('../services/room');
const {
  getChallengeList,
  findChallengeById,
  findChallengeByLanguage,
} = require('../services/challenge');
const { publishToQueue } = require('../services/amqp');
const { updateUser } = require('../services/user');
const logger = require('../services/logger');

const { PRODUCER_QUEUE } = process.env;

/**
 * Route handler for getting list of challenges based on a page number.
 *  If no page is provided, will default to first page.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.getChallengeList = async (req, res, next) => {
  const { page, search, orderBy } = req.query;

  // Check if page param is a number
  if (Number.isNaN(page - 0)) {
    const err = new Error('A non-numberical was used for pages');
    err.status = 400;
    return next(err);
  }

  const limit = 10; // Max number of items to response with
  const skip = page ? (page - 1) * limit : 1;
  const filter = { isPublic: true };
  let sort = {};

  if (search && search !== '') filter.title = new RegExp(search, 'i');
  if (orderBy) {
    if (orderBy === 'oldest') sort = 'createBy';
    if (orderBy === 'newest') sort = '-createBy';
  }

  if (skip < 0) {
    const err = new Error('A negative number was used for pages');
    err.status = 400;
    return next(err);
  }

  try {
    const challenges = await getChallengeList(skip, limit, filter, sort);

    res.json({ challenges });
  } catch (err) {
    next(err);
  }
};

/**
 * Route handler for creating a private room for a given challenge id.
 *  Responses with JSON with id of the room.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.createPrivateRoom = async (req, res, next) => {
  const cId = req.params.id;
  const { _id: userId } = req.user;
  const { language } = req.body;

  try {
    // Find challenge and check that the selected language is valid
    const challenge = await findChallengeByLanguage(cId, language);

    if (!challenge) {
      const error = new Error(`Challenge ${cId} does not exists.`);
      error.status = 404;
      throw error;
    }

    let initCode = '';

    challenge.initialCode.forEach((template) => {
      if (template.language === language) {
        initCode = template.code;
      }
    });

    const room = await createRoom(cId, [userId], language, true, 2, initCode);

    res.json({ room: room.id });
  } catch (err) {
    next(err);
  }
};

/**
 * Route handler for getting data on a given room. Responses with JSON form of
 *  room and challenge data.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.getRoomInfo = async (req, res, next) => {
  const { cId, rId } = req.params;
  const { _id: uId } = req.user;

  try {
    const [challenge, room] = await Promise.all([
      findChallengeById(cId),
      findRoom(rId),
    ]);

    /*
     * Check if the room/challenge don't exists or
     *  the room is inaccessible to current user
     */
    if (!challenge || !room) {
      const error = new Error(
        `${challenge ? `Challenge ${cId}` : `Room ${rId}`} does not exist. `,
      );
      error.status = 404;
      throw error;
    } else if (room.users.indexOf(uId) === -1 || room.completed) {
      const error = new Error(`Room ${rId}, is not accessible to this user.`);
      error.status = 404;
      throw error;
    }

    res.json({ challenge, room });
  } catch (err) {
    next(err);
  }
};

/**
 * Route handler for changing room to a public room that someone can be invited
 * to and responses with an invite key.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.convertRoomToPublic = async (req, res, next) => {
  const { rId } = req.params;
  const { _id: uId } = req.user;

  try {
    const room = await setRoomToJoinable(rId, uId);

    if (!room) {
      const e = new Error(
        `User, ${uId}, trying to make room public, but not apart of the room.`,
      );
      e.status = 401;
      e.msg = { error: 'Current user can not make this request.' };
      throw e;
    }

    res.json({ invite: room.inviteKey });
  } catch (err) {
    next(err);
  }
};

/**
 * Route handler for adding user to room and responing with a link to room.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.joinRoomByInvite = async (req, res, next) => {
  const { _id: uId } = req.user;
  const { key } = req.params;

  try {
    const room = await findRoomByInvite(key);

    if (!room) {
      const error = new Error(`Room with key, ${key}, does not exists.`);
      error.status = 500;
      throw error;
    }

    const userInRoom = room.users.indexOf(String(uId)) !== -1;

    if (room.private || (room.users.length === room.size && !userInRoom)) {
      // Room is not accessible to current user.
      const err = new Error('Attemptted to join a full room');
      err.status = 500;
      err.msg = { error: 'Room is not accessible.' };
      throw err;
    }

    // If no user is not in room, add them
    if (!userInRoom) await addUserToRoom(room.id, uId);

    res.json({ link: `/c/${room.challenge}/r/${room.id}` });
  } catch (err) {
    next(err);
  }
};

/**
 * Message handler for code runner results through AMQP. Decodes message and
 *  emits the results to the room. Will also mark the room completed if no tests
 *  fail.
 * @param {Object} channel AMQP channel used to delete message on AMQP server.
 * @param {String} msg AMQP message
 */
exports.receiveSolution = async (channel, msg) => {
  const {
    numOfTests,
    passedTests,
    failedTests,
    time,
    testResults,
    error,
    success,
  } = JSON.parse(msg.content.toString());
  const { correlationId } = msg.properties;

  try {
    // If error occurred, response with only error message
    if (error) {
      channel.ack(msg);
      return emitMessageToRoom(
        'testCompleted',
        correlationId,
        [],
        false,
        error,
      );
    }

    // If success, mark room completed, and update solution/users
    if (!error && success && failedTests === 0) {
      const room = await markRoomCompleted(correlationId);
      const challenge = await findChallengeById(room.challenge);

      const proms = [
        createSolution(
          room.challenge,
          challenge.title,
          room.code,
          room.users,
          room.language,
        ),
      ];

      room.users.forEach((user) => {
        proms.push(updateUser(user, { $inc: { completed: 1 } }));
      });

      await Promise.all(proms);
    }

    emitMessageToRoom(
      'testCompleted',
      correlationId,
      testResults,
      failedTests === 0,
      null,
    );
    channel.ack(msg);
  } catch (err) {
    logger.debug(err);
    channel.ack(msg);
  }
};

/**
 * Route handler for run tests on user's code by sending a request to the
 *  launcher server through AMQP.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function to be called
 */
exports.testSolution = async (req, res, next) => {
  const { code } = req.body;
  const { cId, rId } = req.params;
  const { id: userId } = req.user;

  let room;
  try {
    const challenge = await findChallengeById(cId);

    if (!challenge) {
      const err = new Error(`Non existing challenge, ${cId}, being tested`);
      err.msg = 'Challenge being tested does not exist.';
      err.status = 422;
      throw err;
    }

    // Save code to room
    room = await saveCodeById(rId, userId, code);

    if (!room) {
      const error = new Error(
        `Room, ${rId}, could not be found with User, ${userId}`,
      );
      error.status = 422;
      throw error;
    }
  } catch (err) {
    if (err.status) return next(err);

    const error = new Error(`Invalid challenge, ${cId}, being tested`);
    error.status = 422;
    error.msg = 'Invalid challenge provided.';
    return next(error);
  }

  try {
    // Send message to code runner through SQS Broker
    const sent = publishToQueue(
      PRODUCER_QUEUE,
      JSON.stringify({ code, language: room.language, challengeId: cId }),
      { correlationId: rId },
    );

    if (!sent) {
      const err = new Error('Error occurred trying to request test run');
      err.status = 500;
      err.msg =
        'Unexpected error occurred when running test, please try again.';
      throw err;
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
