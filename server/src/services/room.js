const crypto = require('crypto');
const Room = require('../models/room');

/**
 * Creates a random string as a invite key for a room.
 * @return {String} Returns a invite key as a string.
 */
function createInviteKey() {
  return crypto.randomBytes(20).toString('hex');
}

/**
 * Creates a room for challenge and adds users into it. Will set an invite key
 *  if the room is public.
 * @param {String} challengeId Id for challenge room is set to
 * @param {Array} users Array of user id that can join the room
 * @param {String} language Programming language being used
 * @param {Boolean} isPrivate Flag to indicate if room is private
 * @param {Number} size Max number of user in the room
 * @return Returns a promise that resolves with the room object.
 */
exports.createRoom = (
  challengeId,
  users,
  language,
  isPrivate = false,
  size = 2
) => {
  const inviteKey = !isPrivate ? createInviteKey() : null;

  return Room({
    challenge: challengeId,
    language,
    users,
    private: isPrivate,
    inviteKey,
    size,
    userInRoom: users.length,
  }).save();
};

/**
 * Finds and returns a room.
 * @param {String} id The id of the room to find
 * @return {Promise<Object>} A promise to resolve with a room object, or null
 *  if no room is found.
 */
exports.findRoom = (id) => {
  return Room.findById(id).exec();
};

/**
 * Finds and returns a room by the invite key.
 * @param {String} inviteKey Invite key for a room
 * @returns {Promise<Object>} Returns a promise to resolve with a room object if
 *  found, otherwise with null.
 */
exports.findRoomByInvite = (inviteKey) => {
  return Room.findOne({ inviteKey }).exec();
};

/**
 * Finds and updates the room private flag and adds a invite key if the userId
 *  provided belonges to the room.
 * @param {String} id The id of the room to make joinable
 * @param {String} userId The id of the user trying to make the room public
 * @return {Promise<Object>} A promise to resolve with the room object
 *  before it's updated.
 */
exports.setRoomToJoinable = (roomId, userId) => {
  return Room.findOneAndUpdate(
    { _id: roomId, users: userId },
    { private: false, inviteKey: createInviteKey() },
    { new: true }
  ).exec();
};

/**
 * Adds a user to the room and increase room count if there's is room and
 *  user is not already in the room.
 * @param {String} roomId The id of the room to add the user to
 * @param {String} userId The id of the user to add to the room
 * @param {Object} options Query options
 * @return {Promise<Object>} A promise to resolve with the room object
 *  before updating, or null if room is full or not found.
 */
exports.addUserToRoom = (roomId, userId, options = null) => {
  return Room.findOneAndUpdate(
    {
      _id: roomId,
      $expr: { $lt: ['$usersInRoom', '$size'] },
      users: { $ne: userId },
    },
    { $addToSet: { users: userId }, $inc: { usersInRoom: 1 } },
    options
  ).exec();
};

/**
 * Finds and updates a room's current code by it's id.
 * @param {String} id Id of a room
 * @param {String} userId Id of user saving (used to ensure user is in room)
 * @param {String} code Code to store
 * @return {Promise<Object>} Returns a promise to resolve with an room object
 *  with the updated code.
 */
exports.saveCodeById = (id, userId, code) => {
  return Room.findOneAndUpdate(
    { _id: id, users: userId },
    { code },
    { new: true }
  ).exec();
};

/**
 * Appends a message to a room.
 * @param {String} id Id of room
 * @param {Object} message Object containing message and meta data
 * @param {Object} options Query options ({new: true} for updated document)
 * @return {Promise<Object>} Returns a promise to resolve with the updated
 */
exports.addMessageById = (id, message, options = null) => {
  return Room.findOneAndUpdate(
    { _id: id },
    { $push: { messages: message } },
    options
  ).exec();
};

/**
 * Finds and updates a room to be marked completed.
 * @param {String} id The id of the room to mark completed.
 * @param {Object} options Query options ( {new: true} for updated documents)
 * @return {Promise<Object>} A promise to resolve with a room object, or null
 *  if no room is found.
 */
exports.markRoomCompleted = (id, options = null) => {
  return Room.findByIdAndUpdate(
    id,
    {
      completed: true,
    },
    options
  ).exec();
};
