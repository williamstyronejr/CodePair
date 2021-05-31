const request = require('supertest');
const app = require('../../services/app');
const userRouter = require('../user');
const { sendEmailTemplate } = require('../../services/emailer');
const {
  connectDatabase,
  disconnectDatabase,
} = require('../../services/database');
const { createRandomString } = require('../../utils/utils');

const { IP, PORT, DB_TEST_URI: DB_URI } = process.env;

// Mocked to prevent sending emails during testing
jest.mock('../../services/emailer');

app.use(userRouter);

beforeAll(async () => {
  await connectDatabase(DB_URI);
});

afterAll(async () => {
  await disconnectDatabase();
});

beforeEach(() => {
  // Reset mocks
  sendEmailTemplate.mockClear();
});

/**
 * Creates and returns a request to create user with provided params.
 * @param {String} username Username for new user
 * @param {String} email Email for new user
 * @param {String} password Password for new user
 * @return {Promise<Object>} A promise to resolve with a response object.
 */
function createUserRoute(username, email, password) {
  return request(app)
    .post('/signup')
    .send({ username, email, password })
    .set('Accept', 'application/json')
    .expect(200);
}

/**
 * Creates and returns a request to log a user in.
 * @param {String} username Username to use to signin
 * @param {String} password Password to use to signin
 * @param {Number} status Expected status code to receive
 * @return {Promise<Object>} A promise to resolve with a response object.
 */
function signinRoute(username, password, status = 200) {
  return request(app)
    .post('/signin')
    .send({ username, password })
    .set('Accept', 'application/json')
    .expect(status);
}

/**
 * Creates and returns a request to send a password reset email.
 * @param {String} field A username/email of user to send reset email to
 * @param {Number} status Expected stauts code to receive from request
 * @return {Promise<Object>} A promise to resolve with a response object.
 */
function emailRecoveryRoute(field, status = 200) {
  return request(app)
    .post('/account/recovery/password')
    .send({ field })
    .set('Accept', 'application/json')
    .expect(status);
}

describe('/POST /inputvalidator', () => {
  const routeToTest = () => '/inputvalidator';
  test('Empty data  should response 200', async () => {
    await request(app)
      .post(routeToTest())
      .send({})
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.success).toBeTruthy();
      });
  });

  test('Invalid username should throw 400 error with details', async () => {
    const username = '';
    await request(app)
      .post(routeToTest())
      .send({ username })
      .expect(400)
      .catch((err) => {
        expect(err.errors).toBeDefined();
        expect(err.errors.username).toBeDefined();
      });
  });

  test('Invalid email should throw 400 error with details', async () => {
    const email = '';
    await request(app)
      .post(routeToTest())
      .send({ email })
      .expect(400)
      .catch((err) => {
        expect(err.errors).toBeDefined();
        expect(err.errors.email).toBeDefined();
      });
  });
});

describe('/POST /signup', () => {
  const routeToTest = () => '/signup';
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'pass';

  test('Successfully signup should response 200 and sets JWT in cookie and user data', async () => {
    await request(app)
      .post(routeToTest())
      .send({ username, email, password })
      .expect(200)
      .then((res) => {
        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.headers['set-cookie'][0].includes('token')).toBeTruthy();

        expect(res.body.user).toBeDefined();
        expect(res.body.user.hash).not.toBeDefined(); // Password not sent back
      });
  }, 10000);

  test('Signup with a used username should throws 400 error with details', async () => {
    // Requires a users to be created in previous test
    await request(app)
      .post(routeToTest())
      .send({ username, email: `e${email}`, password })
      .set('Accept', 'application/json')
      .expect(400)
      .catch((err) => {
        expect(err.body.errors).toBeDefined();
        expect(err.body.errors.username).toBeDefined();
        expect(err.body.errors.email).not.toBeDefined();
      });
  });

  test('Signup with a used email should throws 400 error with details', async () => {
    // Requires a users to be created in previous test
    await request(app)
      .post(routeToTest())
      .send({ username: `u${username}`, email, password })
      .set('Accept', 'application/json')
      .expect(400)
      .catch((err) => {
        expect(err.body.errors).toBeDefined();
        expect(err.body.errors.email).toBeDefined();
        expect(err.body.errors.username).not.toBeDefined();
      });
  });

  test('Signing up as with invalid data should throw 400 error with details', async () => {
    const invalidUsername = '';
    const invalidEmail = '';
    const invalidPassword = '';

    await request(app)
      .post(routeToTest())
      .send({
        username: invalidUsername,
        email: invalidEmail,
        password: invalidPassword,
      })
      .set('Accept', 'application/json')
      .expect(400)
      .catch((err) => {
        expect(err.body.errors).toBeDefined();
        expect(err.body.errors.username).toBeDefined();
        expect(err.body.errors.email).toBeDefined();
        expect(err.body.errors.password).toBeDefined();
      });
  });
});

describe('/POST /signin', () => {
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'pass';

  beforeAll(async () => {
    // Create a new user
    await createUserRoute(username, email, password);
  }, 10000);

  test('Sign in with incorrect username should throws 401 error', async () => {
    await signinRoute(`${username}1`, password, 401).catch((err) => {
      expect(err).toBeDefined();
    });
  }, 10000);

  test('Sign in with incorrect password should throws 401 error', async () => {
    await signinRoute(username, `${password}1`, 401).catch((err) => {
      expect(err).toBeDefined();
    });
  }, 10000);

  test('Valid signin should response 200 with JWT in cookie and user data', async () => {
    await signinRoute(username, password, 200).then((res) => {
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0].includes('token')).toBeTruthy();

      expect(res.body.user).toBeDefined();
      expect(res.body.user.hash).not.toBeDefined();
    });
  }, 10000);
});

describe('/GET /user/:username/data', () => {
  const routeToTest = (username) => `/user/${username}/data`;
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'pass';

  beforeAll(async () => {
    // Create a user to be serached for
    await createUserRoute(username, email, password);
  }, 20000);

  test('User not found should throw 404 error', async () => {
    await request(app)
      .get(routeToTest(`${username}1`))
      .set('Accept', 'application/json')
      .expect(404);
  });

  test('User found should response 200 with user data', async () => {
    await request(app)
      .get(routeToTest(username))
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.hash).not.toBeDefined();
        expect(res.body.username).toBeDefined();
        expect(res.body.email).toBeDefined();
        expect(res.body.displayName).toBeDefined();
        expect(res.body.profileImage).toBeDefined();
      });
  });
});

describe('/POST /account/recovery/password', () => {
  const routeToTest = () => '/account/recovery/password';
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'pass';

  beforeAll(async () => {
    await createUserRoute(username, email, password);
  }, 10000);

  test('Non-existing username should response 200 with success', async () => {
    await request(app)
      .post(routeToTest())
      .send({ field: `${username}1` })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.success).toBeTruthy();
      });
  });

  test('Non-existing email should response 200 with success', async () => {
    await request(app)
      .post(routeToTest())
      .send({ field: `e${email}` })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.success).toBeTruthy();
      });
  });

  test('Valid username should response 200 with success and call to emailer', async () => {
    await request(app)
      .post(routeToTest())
      .send({ field: username })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.success).toBeTruthy();
        expect(sendEmailTemplate.mock.calls.length).toBe(1);
      });
  });

  test('Valid email should response 200 with success and call to emailer', async () => {
    await request(app)
      .post(routeToTest())
      .send({ field: email })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.success).toBeTruthy();
        expect(sendEmailTemplate.mock.calls.length).toBe(1);
      });
  });
});

describe('/POST /settings/password', () => {
  const routeToTest = () => '/settings/password';
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'pass';
  const newPassword = 'pass1';
  let userCookie; // User token to use as authorization

  beforeAll(async () => {
    await createUserRoute(username, email, password).then((res) => {
      userCookie = res.headers['set-cookie'][0];
    });
  }, 20000);

  test('Incorrect current password should throw 400 error', async () => {
    await request(app)
      .post(routeToTest())
      .set('Cookie', userCookie)
      .send({
        password: `${password}c`,
        newPassword,
        confirmPassword: newPassword,
      })
      .expect(400)
      .catch((err) => {
        expect(err.response.body.errors.password).toBeDefined();
      });
  }, 15000);

  test('Successful request should response 200 with success and can signin with new password ', async () => {
    await request(app)
      .post(routeToTest())
      .set('Cookie', userCookie)
      .send({ password, newPassword, confirmPassword: newPassword })
      .expect(200)
      .then((res) => {
        expect(res.body.success).toBeDefined();
      });

    // Can login with new password
    await signinRoute(username, newPassword, 200).then((res) => {
      expect(res.body.success).toBeTruthy();
    });
  }, 20000);
});

describe('/GET /user/data', () => {
  const routeToTest = () => '/user/data';
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'pass';
  let userCookie;

  beforeAll(async () => {
    // Create user to test with and sign user in
    await createUserRoute(username, email, password);
    await signinRoute(username, password).then((res) => {
      userCookie = res.headers['set-cookie'][0];
    });
  }, 20000);

  test('Invalid cookie should throw 401 error', async () => {
    await request(app).get(routeToTest()).set('Cookie', 'token=2').expect(401);
  });

  test('Valid token should response 200 with user data', async () => {
    await request(app)
      .get(routeToTest())
      .set('Cookie', userCookie)
      .expect(200)
      .then((res) => {
        expect(res.body.username).toBeDefined();
        expect(res.body.hash).not.toBeDefined();
      });
  });
});

describe('/POST /account/reset/password?id&token', () => {
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'pass';
  const newPassword = 'pass1';
  let resetRoute; // Route is generated by server

  beforeAll(async () => {
    // Create a new user and send a password reset email
    await createUserRoute(username, email, password);
    await emailRecoveryRoute(username).then((res) => {
      resetRoute = sendEmailTemplate.mock.calls[0][3].link.split(
        `${IP}:${PORT}`
      )[1];
    });
  }, 20000);

  test('Invalid password should throw 400 with error message', async () => {
    const invalidPassword = 'p';

    await request(app)
      .post(resetRoute)
      .send({ password: invalidPassword, passwordC: invalidPassword })
      .set('Accpet', 'application/json')
      .expect(400)
      .catch((err) => {
        expect(err.body.errors.newPassword).toBeDefined();
      });
  });

  test('Incorrect confirm password throw 400 error', async () => {
    await request(app)
      .post(resetRoute)
      .send({ password: newPassword, passwordC: `${newPassword}1` })
      .set('Accpet', 'application/json')
      .expect(400)
      .catch((err) => {
        expect(err.body.errors.newPasswordC).toBeDefined();
      });
  });

  test('Using invalid tokens responses with a 400 error', async () => {
    await request(app)
      .post(`${resetRoute}1`)
      .send({ password: newPassword, passwordC: newPassword })
      .set('Accpet', 'application/json')
      .expect(400)
      .catch((err) => {
        expect(err).toBeDefined();
      });
  });

  test('Successful password resets responses with 200', async () => {
    await request(app)
      .post(resetRoute)
      .send({ password: newPassword, passwordC: newPassword })
      .set('Accpet', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.success).toBeTruthy();
      });

    // Check if user can sign in with new password
    await signinRoute(username, newPassword).then((res) => {
      expect(res.body.success).toBeTruthy();
    });
  }, 20000);
});

describe('/POST /settings/account', () => {
  const routeToTest = () => '/settings/account';
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'pass';
  let userCookie; // Cookie for user auth

  beforeAll(async () => {
    await createUserRoute(username, email, password).then((res) => {
      userCookie = res.headers['set-cookie'][0];
    });
  }, 10000);

  test('Sending used username should throw 400 error with message', async () => {
    await request(app)
      .post(routeToTest())
      .set('accept', 'multipart/form-data')
      .field({ username })
      .set('Cookie', userCookie)
      .expect(400)
      .catch((err) => {
        expect(err.response.data.errors.username);
      });
  }, 10000);

  test('Sending used email should throw 400 error with message', async () => {
    await request(app)
      .post(routeToTest())
      .set('accept', 'multipart/form-data')
      .field({ email })
      .set('Cookie', userCookie)
      .expect(400)
      .catch((err) => {
        expect(err.body.errors.email);
      });
  }, 10000);

  test('Successful request should response 200 with success', async () => {
    const newUsername = `${username}2`;
    const newEmail = createRandomString(8, '@email.com');

    await request(app)
      .post(routeToTest())
      .set('accept', 'multipart/form-data')
      .field({ username: newUsername, email: newEmail })
      .set('Cookie', userCookie)
      .expect(200)
      .then((res) => {
        expect(res.body.success).toBeTruthy();
      });

    // Try logging in with the new username
    await signinRoute(newUsername, password).then((res) => {
      expect(res.body.success).toBeTruthy();
    });
  }, 20000);
});

describe('/POST /account/register', () => {
  const routeToTest = () => '/account/register';
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'pass';
  let userCookie; // Cookie for user auth

  beforeAll(async () => {
    await createUserRoute(username, email, password).then((res) => {
      userCookie = res.headers['set-cookie'][0];
    });
  }, 10000);

  test('Unauth request request should throw 401 error', async () => {
    await request(app).post(routeToTest()).expect(401);
  });

  test('Invalid username should throw 400 with error message', async () => {
    const invalidUsername = 't';

    await request(app)
      .post(routeToTest())
      .send({ username: invalidUsername })
      .set('Accept', 'application/json')
      .set('Cookie', userCookie)
      .expect(400)
      .catch((err) => {
        expect(err.body.errors).toBeDefined();
        expect(err.body.errors.username).toBeDefined();
      });
  });

  test('Local auth user request should throw 400 error', async () => {
    const validUsername = createRandomString(8);

    await request(app)
      .post(routeToTest())
      .send({ username: validUsername })
      .set('Accept', 'application/json')
      .set('Cookie', userCookie)
      .expect(401)
      .catch((err) => {
        expect(err.body.errors).toBeDefined();
        expect(err.body.errors.username).toBeDefined();
      });
  });
});
