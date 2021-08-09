const { createSolution, findUserSolutions } = require('../solution');
const { connectDatabase, disconnectDatabase } = require('../database');

const { DB_TEST_URI } = process.env;

beforeAll(async () => {
  await connectDatabase(DB_TEST_URI);
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('Creating solutions', () => {
  test('Successfully creating solution should response with solution object', async () => {
    const challengeId = 'id';
    const challengeName = 'test';
    const code = 'test';
    const users = ['12'];
    const language = 'node';

    const solution = await createSolution(
      challengeId,
      challengeName,
      code,
      users,
      language
    );

    expect(solution).toBeDefined();
    expect(solution.challengeId).toBe(challengeId);
    expect(solution.code).toBe(code);
    expect(solution.users[0]).toBe(users[0]);
  });
});

describe('Finding user solutions by username', () => {
  const userId = 'testnjfds';

  beforeAll(async () => {
    const challengeId1 = 'id1';
    const challengeName = 'test';
    const challengeId2 = 'id2';
    const code = 'test';
    const language = 'node';
    const users = [userId];

    await Promise.all([
      createSolution(challengeId1, challengeName, code, users, language),
      createSolution(challengeId2, challengeName, code, users, language),
    ]);
  });

  test('Getting user solutions first page should return a list with solutions', async () => {
    const list = await findUserSolutions(userId);

    expect(list).toBeDefined();
    expect(list.length).toBeGreaterThan(0);
  });

  test('Getting user solutions out of bounds should return an empty list', async () => {
    const list = await findUserSolutions(userId, 10, 99999);

    expect(list).toBeDefined();
    expect(list.length).toBe(0);
  });
});
