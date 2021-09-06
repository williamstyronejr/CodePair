const amqp = require('amqplib/callback_api');

let channel;
let connection;

/**
 * Connect to AMQP and creates a new channel.
 * @param {String} url Amqp url to connect to
 * @return {Promise<Void>} Returns a promise to resolve when a connection is
 *  made and a channel is opened.
 */
exports.connectAMQP = (url) => {
  return new Promise((res, rej) => {
    amqp.connect(url, (err, conn) => {
      if (err) return rej(err);

      connection = conn;
      connection.createChannel((chErr, ch) => {
        if (chErr) rej(chErr);

        channel = ch;
        res();
      });
    });
  });
};

/**
 * Closes the connection to amqp server.
 * @return {Promise<Void>} Returns a promise to resolve when the connection is
 *  close.
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
 * Set up a consumer on the connected server.
 * @param {String} queue Name of queue to consume messages from.
 * @param {Function} messageHandler Callback to handle messages from queue.
 *  To recieve (channel, msg)
 */
exports.setupConsumer = (queue, messageHandler) => {
  if (!channel) throw new Error('No connection has been made.');

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
 * @param {String} queue Name of queue to send message to
 * @param {Object} data Additional data to be sent along with message
 * @param {Object} options Options to set for message
 * @return {Boolean} Returns a boolean indicating if the message was sent.
 */
exports.publishToQueue = (queue, data, options = {}) => {
  if (!channel) throw new Error('No connection has been made.');

  return channel.sendToQueue(queue, Buffer.from(data), options);
};
