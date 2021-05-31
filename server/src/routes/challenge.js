const router = require('express').Router();
const bodyParser = require('body-parser');
const {
  createChallenge,
  getChallengeList,
  createPrivateRoom,
  getRoomInfo,
  testSolution,
  convertRoomToPublic,
  joinRoomByInvite,
} = require('../controllers/challenge');
const { validateCodeTest } = require('../middlewares/validation');
const { requireAuth } = require('../controllers/authentication');

const jsonParser = bodyParser.json();
router.post('/challenge/create', jsonParser, createChallenge);
router.get('/challenge/list', getChallengeList);

router.post(
  '/challenge/:id/create',
  requireAuth,
  jsonParser,
  createPrivateRoom
);

// Routes for challenge room
router.get('/challenge/:cId/room/:rId', requireAuth, getRoomInfo);

router.post(
  '/challenge/:cId/room/:rId/test',
  requireAuth,
  jsonParser,
  validateCodeTest,
  testSolution
);

router.post('/room/:rId/public', requireAuth, convertRoomToPublic);

router.post('/invite/:key', requireAuth, jsonParser, joinRoomByInvite);

module.exports = router;
