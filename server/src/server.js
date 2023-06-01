const http = require('http');
const {
  setUpChallengeQueue,
  setUpRoomCleanUp,
  setUpRoomDeletion,
} = require('./services/scheduler');
const { connectDatabase } = require('./services/database');
const app = require('./services/app');
const { setupRedis } = require('./services/redis');
const { setupSocket } = require('./services/socket');
const { connectAMQP, setupConsumer } = require('./services/amqp');
const { receiveSolution } = require('./controllers/challenge');
const logger = require('./services/logger');

const {
  IP,
  PORT,
  DB_URI,
  REDIS_PORT,
  REDIS_HOST,
  REDIS_URL,
  REDISCLOUD_URL,
  RABBITMQ_URL,
  CONSUMER_QUEUE,
  DOMAIN,
  NODE_ENV,
} = process.env;

async function startServer() {
  try {
    if (NODE_ENV === 'production' && !DOMAIN)
      throw new Error('Domain needs to be set in production');

    // Connect to all external services
    await Promise.all([
      setupRedis(REDIS_HOST, REDIS_PORT, REDISCLOUD_URL || REDIS_URL),
      connectDatabase(DB_URI),
      connectAMQP(RABBITMQ_URL),
    ]);

    const server = http.createServer(app);
    setupSocket(server);

    // Schedule corn jobs
    setUpChallengeQueue();
    setUpRoomCleanUp();
    setUpRoomDeletion();

    server.listen(PORT, IP, () => {
      // Setup listener for receiving code testing results through rabbitmq
      setupConsumer(CONSUMER_QUEUE, receiveSolution);

      logger.info(`Server is running on ${IP}:${PORT}`);
    });
  } catch (err) {
    console.log(err);
    logger.log('error', 'Server crashing error: \n', err);
    process.exit(0);
  }
}

module.exports = startServer;
