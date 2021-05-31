const amqp = require('amqplib/callback_api');

let channel;
let connection;

/**
 * Connect to AMQP and creates a new channel for global uses.
 * @param {String} url Amqp url to connect to
 * @return {Promise<Void>} Returns a promise to resolve when a connection is made
 *  and a channel is opened.
 */
exports.connectAMQP = (url) => {
  return new Promise((res, rej) => {
    amqp.connect(url, (err, conn) => {
      if (err) return rej(err);
      connection = conn;
      connection.createChannel((error, ch) => {
        if (error) rej(error);

        channel = ch;
        res();
      });
    });
  });
};

/**
 * Closes the connection to amqp server.
 * @return {Promise<Void>} Returns a promise to resolve when the connection is close.
 */
exports.closeAMQP = () => {
  return new Promise((res, rej) => {
    connection.close((err) => {
      if (err) return rej(err);
      res();
    });
  });
};

/**
 * Set up a consumer on the connected server
 * @param {String} queue Name of queue to consume messages from.
 * @param {Function} messageHandler Callback to handle messages from queue, that
 *  will receive (channel, msg).
 */
exports.setupConsumer = (queue, messageHandler) => {
  if (!channel) throw new Error('No channel available');
  channel.consume(
    queue,
    (msg) => {
      messageHandler(channel, msg);
    },
    { noAck: false }
  );
};

/**
 * Publish a message to a given queue.
 * @param {String} queue Name of queue to send message
 * @param {String} content Content to send with message
 * @param {Object} options Options to set for message
 * @return {Boolean} Returns a boolean indicating if the message was sent.
 */
exports.publishToQueue = (queue, content, options = {}) => {
  if (!channel) throw new Error('No channel available');
  return channel.sendToQueue(queue, Buffer.from(content), options);
};
