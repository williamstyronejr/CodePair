const {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUsers,
  usernameEmailAvailability,
  updateUserPassword,
} = require('../user');
const { connectDatabase, disconnectDatabase } = require('../database');
const { createRandomString } = require('../../utils/utils');

const { DB_TEST_URI } = process.env;

beforeAll(async () => {
  await connectDatabase(DB_TEST_URI);
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('Creating users', () => {
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'password';

  test('Created successfully with all parameter and hashed password', async () => {
    const user = await createUser(username, email, password);

    expect(user.username).toBe(username);
    expect(user.email).toBe(email);
    expect(user.hash === password).toBe(false);
  }, 10000);

  test('Creating user with an already used email should result in an error', async () => {
    // Assumes a user was already created previously with "username"
    const username2 = createRandomString(8);

    await expect(createUser(username2, email, password)).rejects.toBeDefined();
  }, 20000);
});

describe('Finding users', () => {
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const username2 = createRandomString(8);
  const email2 = createRandomString(8, '@email.com');
  const password = 'password';

  beforeAll(async () => {
    await Promise.all([
      createUser(username, email, password),
      createUser(username2, email2, password),
    ]);
  }, 10000);

  test('An existing user with email should return a user object', async () => {
    const user = await findUserByEmail(email);
    expect(user).toBeDefined();
    expect((user.email = email));
  });

  test('An existing user with the username should return a user object', async () => {
    const user = await findUserByUsername(username);
    expect(user).toBeDefined();
    expect(user.username).toBe(username);
  });

  test('Searching for all users should return an array of users', async () => {
    const users = await findUsers({});
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(1);
  });
});

describe('Checking username/email availability', () => {
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'password';

  beforeAll(async () => {
    await createUser(username, email, password);
  }, 10000);

  test('An existing username should return a user object', async () => {
    const user = await usernameEmailAvailability(username, email);

    expect(user).toBeDefined();
    expect(user.username).toBe(username);
  }, 10000);

  test('A non-existing username should return null', async () => {
    const user = await usernameEmailAvailability('', '');

    expect(user).toBeNull();
  }, 10000);
});

describe('Updating user', () => {
  let user;
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'pass';

  beforeAll(async () => {
    user = await createUser(username, email, password);
  }, 10000);

  test('Invalid id should throw an error', async () => {
    const invalidId = 'test';
    const newPassword = 'test';

    try {
      await updateUserPassword(invalidId.lastIndexOf, newPassword);
    } catch (err) {
      expect(err).toBeDefined();
    }
  }, 10000);

  test('Updating password should change user hash', async () => {
    const newPassword = 'testing';

    const updatedUser = await updateUserPassword(user.id, newPassword, {
      new: true,
    });

    expect(updatedUser).toBeDefined();
    expect(updatedUser.hash === user.hash).toBeFalsy();
    expect(updatedUser.hash === newPassword).toBeFalsy();
  }, 20000);
});
