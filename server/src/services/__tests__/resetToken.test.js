const { generateToken, findTokenById, deleteToken } = require('../resetToken');
const { connectDatabase, disconnectDatabase } = require('../database');

const { DB_TEST_URI: DB_URI } = process.env;

beforeAll(async () => {
  await connectDatabase(DB_URI);
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('Creating tokens', () => {
  test('Should throw error when no userId is passed', async () => {
    try {
      const token = await generateToken();
      expect(token).toBeUndefined();
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  test('Create token using userId should return an id and token value', async () => {
    const userId = '123';

    const { id, token } = await generateToken(userId);
    expect(id).toBeDefined();
    expect(token).toBeDefined();

    // Checking for mongoose responding with object
    expect(typeof id).toBe('string');
  });
});

describe('Finding token by id', () => {
  test('Invalid token id should throw error', async () => {
    try {
      await findTokenById('123');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  test('Valid id should return a reset token', async () => {
    const { id, token } = await generateToken('123');
    // Checking for mongoose responding with object
    expect(typeof id).toBe('string');

    const resetToken = await findTokenById(id);
    expect(resetToken).toBeDefined();
  });
});

describe('Deleting token', () => {
  const userId = '123';

  test('Invalid token id should throw error', async () => {
    try {
      await deleteToken('123');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  test('Deleted token should no longer be searchable', async () => {
    const { id, token } = await generateToken(userId);
    await deleteToken(id);

    const resetToken = await findTokenById(id);
    expect(resetToken).toBeNull();
  });
});
