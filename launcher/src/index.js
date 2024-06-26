require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
  connectAMQP,
  setupConsumer,
  publishToQueue,
} = require('./services/amqp');
const { launchContainer } = require('./services/launcher');
const logger = require('./services/logger');

const { RABBITMQ_URL, CONSUMER_QUEUE, PRODUCER_QUEUE } = process.env;

/**
 * Creates temporary code folder if it doesn't exist. Needs to be called on
 *  startup before connection to RabbitMQ to prevent errors.
 * @return {Promise<Void>} Returns a promise to resolve when folder is created.
 */
async function createTempFolder() {
  const tempCodeLoc = path.join(__dirname, 'temp', 'code');

  await fs.promises.mkdir(tempCodeLoc, { recursive: true });
}

/**
 * Validates parameters for code launcher to prevent loading docker containers
 *  for invalid inputs.
 * @param {String} code Code to be tested
 * @param {String} language Language of code
 * @param {String} challengeId Id of challenge to run test against
 * @return {Boolean} Returns true if no errors are thrown.
 */
function validateMessage(code, language, challengeId) {
  if (!language) {
    const err = new Error();
    err.msg = 'Please provide the language the code is written in.';
    err.status = 422;
    throw err;
  }

  if (!code || typeof code !== 'string') {
    const err = new Error();
    err.msg = 'Please provide the code to run test on.';
    err.status = 422;
    throw err;
  }

  if (!challengeId) {
    const err = new Error();
    err.msg = 'Please provide the challenge the code belongs to.';
    err.status = 422;
    throw err;
  }

  return true;
}

/**
 * Handler for messages from queue by running the test on the provided code and
 *  publishing the results or errors to the separate queue.
 * @param {Object} channel AMQP channel to publish message to.
 * @param {Object} msg Incoming message of code to run tests on
 */
async function messageHandler(channel, msg) {
  try {
    const { correlationId: id } = msg.properties;
    const { code, challengeId, language } = JSON.parse(msg.content.toString());

    logger.debug(`Handling message: ${id}, ${challengeId}, ${language}`);

    validateMessage(code, language, challengeId);

    const results = await launchContainer(code, language, challengeId);

    publishToQueue(
      PRODUCER_QUEUE,
      JSON.stringify({ ...results, success: results.error || true }),
      {
        correlationId: id,
      }
    );

    logger.debug(JSON.stringify(results));
    channel.ack(msg);
  } catch (err) {
    publishToQueue(
      PRODUCER_QUEUE,
      JSON.stringify({
        success: false,
        error:
          err.msg ||
          'Code runner failed during initialization, please try again.',
      }),
      {
        correlationId: msg.properties.correlationId,
      }
    );

    logger.error(err);
    channel.ack(msg);
  }
}

/**
 * Sets up connect to RabbitMQ and sets
 */
async function main() {
  try {
    await createTempFolder();
    await connectAMQP(RABBITMQ_URL);
    setupConsumer(CONSUMER_QUEUE, messageHandler);
    logger.info('Code runner connected to AMQP');

    process.send('ready'); // For PM2 reload
  } catch (err) {
    logger.error(err);
  }
}

main();
