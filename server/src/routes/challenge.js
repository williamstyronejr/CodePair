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
const {
  validateCodeTest,
  validatePagination,
} = require('../middlewares/validation');
const { requireAuth } = require('../controllers/authentication');

const jsonParser = bodyParser.json();
router.post('/api/challenge/create', jsonParser, createChallenge);
router.get('/api/challenge/list', validatePagination, getChallengeList);

router.post(
  '/api/challenge/:id/create',
  requireAuth,
  jsonParser,
  createPrivateRoom
);

// Routes for challenge room
router.get('/api/challenge/:cId/room/:rId', requireAuth, getRoomInfo);

router.post(
  '/api/challenge/:cId/room/:rId/test',
  requireAuth,
  jsonParser,
  validateCodeTest,
  testSolution
);

router.post('/api/room/:rId/public', requireAuth, convertRoomToPublic);

router.post('/api/invite/:key', requireAuth, jsonParser, joinRoomByInvite);

module.exports = router;
