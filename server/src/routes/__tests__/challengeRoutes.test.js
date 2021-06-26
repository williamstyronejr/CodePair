const request = require('supertest');
const app = require('../../services/app');
const {
  connectDatabase,
  disconnectDatabase,
} = require('../../services/database');
const { publishToQueue } = require('../../services/amqp');
const { createRandomString } = require('../../utils/utils');

const { DB_TEST_URI } = process.env;

// Mocked to prevent sending emails during testing
jest.mock('../../services/amqp');

const title = 'title';
const solution = 'solution';
const prompt = 'prompt';
const tags = 'greedy,functions';
const initialCode = [{ language: 'node', code: 'function main() {}' }];
const username = createRandomString(8);
const username2 = createRandomString(8);
const username3 = createRandomString(8);
const email = createRandomString(8, '@email.com');
const email2 = createRandomString(8, '@email.com');
const email3 = createRandomString(8, '@email.com');
const password = 'pass';
let challenge;
let userCookie; // Authroization token for user
let userCookie2; // Authroization token for user
let userCookie3; // Authroization token for user

beforeAll(async () => {
  // Connect database, create a challenge and 3 users
  await connectDatabase(DB_TEST_URI);

  await Promise.all([
    request(app)
      .post('/challenge/create')
      .send({ title, prompt, solution, tags, initialCode })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        challenge = res.body.challenge;
      }),
    request(app)
      .post('/signup')
      .send({ username, email, password })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        userCookie = res.headers['set-cookie'][0];
      }),
    request(app)
      .post('/signup')
      .send({ username: username2, email: email2, password })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        userCookie2 = res.headers['set-cookie'][0];
      }),
    request(app)
      .post('/signup')
      .send({ username: username3, email: email3, password })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        userCookie3 = res.headers['set-cookie'][0];
      }),
  ]);
}, 12000);

afterAll(async () => {
  await disconnectDatabase();
});

/**
 * Creates a request for creating a room and returns a id of the room.
 * @param {String} challengeId Id of challenge to create room for
 * @param {String} userCookie Cookie containing auth JWT for user
 * @param {String} language Language for challenge
 * @param {Number} status Expected status code for response
 * @return {Promise<String>} A promise to resolve with the id of the room.
 */
function createRoomRoute(challengeId, cookie, language, status = 200) {
  return request(app)
    .post(`/challenge/${challengeId}/create`)
    .set('Cookie', cookie)
    .send({ language })
    .expect(status)
    .then((res) => res.body.room);
}

/**
 * Creates a request to make a room joinable and returns a invite link.
 * @param {Stirng} roomId Id of room to make joinable
 * @param {String} cookie Cookie containing auth JWT for user
 * @param {Number} status Expected status code
 * @return {Promise<String>} A promise to resolve with the invite link.
 */
function makeRoomJoinableRoute(roomId, cookie, status = 200) {
  return request(app)
    .post(`/room/${roomId}/public`)
    .set('Cookie', cookie)
    .expect(status)
    .then((res) => res.body.invite);
}

describe('/POST /challenge/create', () => {
  const challengeTitle = 'title';
  const challengePrompt = 'prompt';
  const challengeTags = 'greedy,functions';
  const chalengeInitialCode = [{ language: 'node', code: 'function add() {}' }];

  test('Valid request should response 200 with success message', async () => {
    return request(app)
      .post('/challenge/create')
      .send({
        title: challengeTitle,
        prompt: challengePrompt,
        tags: challengeTags,
        initialCode: chalengeInitialCode,
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.challenge).toBeDefined();
        expect(res.body.challenge.title).toBe(challengeTitle);
        expect(res.body.challenge.prompt).toBe(challengePrompt);
        expect(res.body.challenge.tags).toBe(challengeTags);
      });
  });
});

describe('/POST /challenge/:id/create', () => {
  test('Unauth request should throws 401 error', async () => {
    await createRoomRoute('123', '123', 'node', 401);
  });

  test('Valid parameters should response 200 with room data', async () => {
    const challengeId = challenge._id;
    const language = 'node';

    const room = await createRoomRoute(challengeId, userCookie, language);
    expect(room).toBeDefined();
  });
});

describe('/GET /challenge/list?page', () => {
  const routeToTest = (page = '0', sort = '', filter = '') =>
    `/challenge/list?page=${page}&search=${filter}&orderBy=${sort}`;

  const title1 = createRandomString(8);
  const title2 = createRandomString(8);
  beforeAll(async () => {
    // Create two challenges
    const tag = '';
    await Promise.all([
      request(app)
        .post('/challenge/create')
        .set('Accept', 'application/json')
        .send({ title: title1, prompt: 'prompt', tags: tag, initialCode }),
      request(app)
        .post('/challenge/create')
        .set('Accept', 'application/json')
        .send({ title: title2, prompt: 'prompt', tags: tag, initialCode }),
    ]);
  });

  test('Non-number page should throw 400 error', async () => {
    await request(app).get('/challenge/list?page=test').expect(400);
  });

  test('Negative numbers throws a 400 error', async () => {
    await request(app).get(`/challenge/list?page=-1`).expect(400);
  });

  test('Valid request should response 200 with array of challenges', async () => {
    const page = 0;

    await request(app)
      .get(routeToTest(page))
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.challenges).toBeDefined();
        expect(Array.isArray(res.body.challenges)).toBeTruthy();
      });
  });

  test('Sorting by oldest should response 200 with sorted array of challenges', async () => {
    const sort = 'oldest';
    const page = '0';
    const filter = '';

    await request(app)
      .get(routeToTest(page, sort, filter))
      .expect(200)
      .then((res) => {
        expect(res.body.challenges).toBeDefined();
        expect(Array.isArray(res.body.challenges)).toBeTruthy();
        expect(res.body.challenges.length).toBeGreaterThan(1);

        const date1 = new Date(res.body.challenges[0].createBy).getTime();
        const date2 = new Date(res.body.challenges[1].createBy).getTime();
        expect(date1).toBeLessThanOrEqual(date2);
      });
  });

  test('Filtering should response 200 with array of challenges matching title', async () => {
    const sort = '';
    const page = '0';
    const filter = title2;

    await request(app)
      .get(routeToTest(page, sort, filter))
      .expect(200)
      .then((res) => {
        expect(res.body.challenges).toBeDefined();
        expect(Array.isArray(res.body.challenges)).toBeTruthy();
        expect(res.body.challenges.length).toBeGreaterThan(0);

        expect(res.body.challenges).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: expect.stringMatching(new RegExp(filter, 'i')),
            }),
          ])
        );
      });
  });
});

describe('/GET /challenge/:cId/room/:rId', () => {
  let roomId;

  beforeAll(async () => {
    // Create a user, challenge, and room
    roomId = await createRoomRoute(challenge._id, userCookie, 'node');
  });

  test('Unauth request should throw 401 error', async () => {
    await request(app)
      .get(`/challenge/${challenge._id}/room/${roomId}`)
      .expect(401);
  });

  test('Invalid challengeId should throw 500 error', async () => {
    await request(app)
      .get(`/challenge/${challenge._id}1/room/${roomId}`)
      .set('Cookie', userCookie)
      .expect(500);
  });

  test('Invalid roomId should throw 500 error', async () => {
    await request(app)
      .get(`/challenge/${challenge._id}/room/${roomId}1`)
      .set('Cookie', userCookie)
      .expect(500);
  });

  test('Valid request should response 200 with room and challenge data', async () => {
    await request(app)
      .get(`/challenge/${challenge._id}/room/${roomId}`)
      .set('Cookie', userCookie)
      .expect(200)
      .then((res) => {
        expect(res.body.room).toBeDefined();
        expect(res.body.challenge).toBeDefined();
      });
  });
});

describe('/POST /room/:rId/public', () => {
  let roomId;

  beforeAll(async () => {
    roomId = await createRoomRoute(challenge._id, userCookie, 'node');
  });

  test('Invalid user token should throw 401 error', async () => {
    await makeRoomJoinableRoute(roomId, '1', 401);
  });

  test('User not in room attempting to make room public should throws 401 error', async () => {
    await makeRoomJoinableRoute(roomId, userCookie2, 401);
  });

  test('Valid request should response 200 with link', async () => {
    const link = await makeRoomJoinableRoute(roomId, userCookie);
    expect(link).toBeDefined();
  });
});

describe('/POST /invite/:invite', () => {
  let roomId;
  let routeToTest; // Should be set in beforeAll

  // Create an valid invite link
  beforeAll(async () => {
    roomId = await createRoomRoute(challenge._id, userCookie, 'node');
    const link = await makeRoomJoinableRoute(roomId, userCookie);
    routeToTest = `/invite/${link}`;
  }, 10000);

  test('Invalid link should throw 500 error', async () => {
    await request(app)
      .post(`${routeToTest}1`)
      .set('Cookie', userCookie2)
      .expect(500)
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.response).toBeDefined(); // Error came from request
      });
  });

  test('Valid request should response 200 with link', async () => {
    await request(app)
      .post(routeToTest)
      .set('Cookie', userCookie2)
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.link).toBeDefined();
      });
  });

  test('Joining a room the current user is already in should response 200 with link', async () => {
    await request(app)
      .post(routeToTest)
      .set('Cookie', userCookie2)
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.link).toBeDefined();
      });
  });

  test('Attempting to join a full room should throw a 500 error', async () => {
    await request(app)
      .post(routeToTest)
      .set('Cookie', userCookie3)
      .expect(500)
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.response).toBeDefined(); // Error came from request
      });
  });
});

describe('/POST /challenge/:cId/room/:rId/test', () => {
  const routeToTest = (cId, rId) => `/challenge/${cId}/room/${rId}/test`;
  let roomId;

  // Create a new room
  beforeAll(async () => {
    roomId = await createRoomRoute(challenge._id, userCookie, 'node');
  });

  test('Non-existing params should throw 400 error with error messages', async () => {
    await request(app)
      .post(routeToTest('dnjs', roomId))
      .set('Cookie', userCookie)
      .expect(400)
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.response.data.code).toBeDefined();
        expect(err.response.data.lang).toBeDefined();
      });
  });

  test('Invalid challengeId should throw 400 error with message', async () => {
    const code = 'function main(num, power) { return Math.pow(num, power); }';
    const language = 'node';
    const invalidChallengeId = 'index';

    await request(app)
      .post(routeToTest(invalidChallengeId, roomId))
      .set('Cookie', userCookie)
      .send({ code, language })
      .expect(422)
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.response.data).toBeDefined();
      });
  });

  test('Valid request should response 200 with success message', async () => {
    const code = 'function main(num, power) { return Math.pow(num, power); }';
    const language = 'node';

    const res = await request(app)
      .post(routeToTest(challenge._id, roomId))
      .set('Cookie', userCookie)
      .send({ code, language })
      .expect(200);

    expect(res).toBeDefined();
    expect(res.body.success).toBeTruthy();
  });
});
