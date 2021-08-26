const { createRandomString } = require('../../utils/utils');
const { checkActiveQueues } = require('../challengeQueue');
const {
  setupRedis,
  closeRedis,
  addUserToQueue,
  getPendingQueue,
} = require('../redis');

let redisClient;

const { REDIS_HOST, REDIS_PORT } = process.env;

beforeAll(async () => {
  redisClient = await setupRedis(REDIS_HOST, REDIS_PORT);
});

afterAll(() => {
  closeRedis();
});

describe('Running queue with one active queue', () => {
  let userId1;
  let userId2;
  let queueId2;
  let queueId3;

  beforeEach(async () => {
    userId1 = createRandomString(8);
    userId2 = createRandomString(8);
    queueId2 = createRandomString(8);
    queueId3 = createRandomString(8);
  });

  test('Queue will not be made if not enough users exists', async () => {
    await addUserToQueue(queueId3, userId1, 3);
    await addUserToQueue(queueId3, userId2, 3);
    const pendingQueueIds = await checkActiveQueues();

    expect(pendingQueueIds[0]).toBeNull();
  });

  test('Creating pending queue will result in hash with userIds', async () => {
    await addUserToQueue(queueId2, userId1);
    await addUserToQueue(queueId2, userId2);

    const pendingQueueIds = await checkActiveQueues();
    expect(Array.isArray(pendingQueueIds)).toBeTruthy();
    expect(pendingQueueIds).toHaveLength(1);
    expect(pendingQueueIds[0]).not.toBeNull(); // Makes sure that id was returned

    const results = await getPendingQueue(pendingQueueIds[0]);

    expect(results).toBeDefined();
    expect(results[userId1]).toBe('false');
    expect(results[userId2]).toBe('false');
  });
});
