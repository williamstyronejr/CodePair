const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  challengeId: { type: String },
  challengeName: { type: String },
  code: { type: String },
  users: [String],
  language: { type: String },
});

const Solution = mongoose.model('solution', solutionSchema);
module.exports = Solution;
