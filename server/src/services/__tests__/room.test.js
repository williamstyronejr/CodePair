const {
  createRoom,
  findRoom,
  setRoomToJoinable,
  addUserToRoom,
  markRoomCompleted,
} = require('../room');
const { connectDatabase, disconnectDatabase } = require('../database');

const { DB_TEST_URI } = process.env;

beforeAll(async () => {
  await connectDatabase(DB_TEST_URI);
}, 10000);

afterAll(async () => {
  await disconnectDatabase();
});

describe('Creating room', () => {
  test('Creating a room with default parameters should return a room object', async () => {
    const challengeId = 'testing';
    const users = [];
    const lang = 'node';

    const room = await createRoom(challengeId, users, lang);

    expect(room).toBeDefined();
    expect(room.challenge).toBe(challengeId);
    expect(room.users).toHaveLength(users.length);
  }, 10000);

  test('Creating a private room should return a room with private flag set to true', async () => {
    const challengeId = 'testing';
    const users = [];
    const lang = 'node';

    const room = await createRoom(challengeId, users, lang, true);

    expect(room).toBeDefined();
    expect(room.private).toBeTruthy();
  });

  test('Creating a room bigger than default should have increased user size', async () => {
    const challengeId = 'testing';
    const users = [];
    const lang = 'node';
    const size = 20;

    const room = await createRoom(challengeId, users, lang, false, size);

    expect(room).toBeDefined();
    expect(room.size).toBe(size);
  });
});

describe('Adding users to room', () => {
  const challengeId = 'testing';
  const users = [];
  const lang = 'node';
  const isPrivate = false;
  const size = 2;
  const userId = '1';

  let room;

  beforeAll(async () => {
    room = await createRoom(challengeId, users, lang, isPrivate, size);
  });

  test('Adding to empty room should return room with new user added', async () => {
    const updatedRoom = await addUserToRoom(room.id, userId, { new: true });

    expect(updatedRoom).toBeDefined();
    expect(updatedRoom.users).toContain(userId);
  });

  test('Adding a user that is already in room will should return null', async () => {
    const updatedRoom = await addUserToRoom(room.id, userId, { new: true });

    expect(updatedRoom).toBeNull();
  });

  test('Adding a user to a full room should return null with no changes to room', async () => {
    const proms = []; // Array of promises

    for (let i = 0; i < size; i += 1) {
      proms.push(addUserToRoom(room.id, `${userId}${i}`));
    }

    await Promise.all(proms); // Full room with users

    const attempttedRoom = await addUserToRoom(room.id, `user${size + 1}`);
    expect(attempttedRoom).toBeNull();

    const updatedRoom = await findRoom(room.id);

    expect(updatedRoom).toBeDefined();
    expect(updatedRoom.users).not.toContain('user3');
  });
});

describe('Updating room', () => {
  const challengeId = '1234';
  const users = ['userid1', 'userid2'];
  const lang = 'node';
  let room;

  beforeAll(async () => {
    room = await createRoom(challengeId, users, lang);
  });

  test('Marking room joinable should return set room to public and add an invite key', async () => {
    const updatedRoom = await setRoomToJoinable(room.id, users[0]);

    expect(updatedRoom).toBeDefined();
    expect(updatedRoom.private).toBeFalsy();
    expect(updatedRoom.inviteKey).toBeDefined();
  });

  test('Marking room to be completed should set completed flag to true', async () => {
    const updatedRoom = await markRoomCompleted(room.id, { new: true });

    expect(updatedRoom).toBeDefined();
    expect(updatedRoom.completed).toBeTruthy();
  });
});
