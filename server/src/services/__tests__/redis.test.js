const {
  setupRedis,
  getQueueSize,
  addUserToQueue,
  removeUserFromQueue,
  popUsersFromQueue,
  markUserAsAccepted,
  addUsersToPendingQueue,
  getPendingQueue,
  activeQueue,
} = require('../redis');
const { createRandomString } = require('../../utils/utils');

let redisClient;
const { REDIS_HOST, REDIS_PORT } = process.env;

// Setup redis client
beforeAll(async () => {
  redisClient = await setupRedis(REDIS_HOST, REDIS_PORT);
});

// Close Redis client
afterAll(() => {
  if (redisClient) {
    redisClient.quit();
  }
});

let queueId = 'queue';
let userId = 'userid';

beforeEach(() => {
  queueId = createRandomString(8);
  userId = createRandomString(8);
});
describe('Active queue list', () => {
  test('Adding user to queue should add queue to active list', async () => {
    let count = await getQueueSize(queueId);
    expect(count).toBe(0); // Queue should start empty

    await addUserToQueue(queueId, userId);
    count = await getQueueSize(queueId);
    expect(count).toBe(1); // Queue should have one user
    expect(activeQueue[queueId]).toBeDefined(); // Queue is added to active list
  });

  test('Removing a user from queue should remove user from list', async () => {
    await addUserToQueue(queueId, userId);
    let count = await getQueueSize(queueId);
    expect(count).toBe(1);

    await removeUserFromQueue(queueId, userId);
    count = await getQueueSize(queueId, userId);
    expect(count).toBe(0);
  });
});

describe('Popping users from queue', () => {
  const max = 2;

  beforeEach(async () => {
    await addUserToQueue(queueId, userId);
  });

  test('Popping users from queue with not enough users should return an empty list', async () => {
    const results = await popUsersFromQueue(queueId, max);
    expect(results).toHaveLength(0);

    // User was not popped
    const count = await getQueueSize(queueId);
    expect(count).toBe(1);
  });

  test('Popping users from queue with enough users should return a list of users with specific length', async () => {
    const promises = [];

    // Loop to add users user till defined max
    for (let i = 0; i < max - 1; i += 1) {
      promises.push(addUserToQueue(queueId, `user${i}`));
    }
    await Promise.all(promises);

    const results = await popUsersFromQueue(queueId, max);
    expect(results).toHaveLength(max);
  });
});

describe('Handling user responses to queue pairs', () => {
  const userId1 = 'user1';
  const userId2 = 'user2';
  const challengeId = 'challengeId';
  const pendingQueueId = 'randomstring';

  beforeEach(() => {
    addUsersToPendingQueue(pendingQueueId, [userId1, userId2], challengeId);
  });

  test('User not in room trying to accept should result in no change to pending queue', async () => {
    const wrongUser = 'user';
    const result = await markUserAsAccepted(pendingQueueId, wrongUser);
    expect(result).toBe(null); // Queue is not ready for room creation

    // Get pending queue and check if both users are false
    const pendingQueue = Object.values(await getPendingQueue(pendingQueueId));
    expect(pendingQueue).not.toContain('true');
  });

  test('Both users accepting queue should return an object with user names and challenge id', async () => {
    const user1Reply = await markUserAsAccepted(pendingQueueId, userId1);
    const user2Reply = await markUserAsAccepted(pendingQueueId, userId2);

    expect(user1Reply).toBe(null);
    expect(user2Reply.challengeId).toBe(challengeId);
    expect(user2Reply[userId1]).toBeDefined();
    expect(user2Reply[userId2]).toBeDefined();
  });
});
