exports.publishToQueue = jest.fn((queue, data, options = {}) => {
  return true;
});
