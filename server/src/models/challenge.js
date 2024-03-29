const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String },
  prompt: { type: String },
  tags: { type: String }, // List sparated by commas
  initialCode: [
    {
      language: { type: String },
      code: { type: String },
    },
  ],
  isPublic: { type: Boolean, default: false },
  createBy: { type: Date, default: Date.now },
  completed: { type: Number, default: 0 },
  summary: { type: String, default: '' },
  difficulty: { type: String, default: 'Easy' },
});

const Challenge = mongoose.model('challenge', challengeSchema);
module.exports = Challenge;
