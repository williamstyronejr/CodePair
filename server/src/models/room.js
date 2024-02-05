const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  challenge: { type: String },
  language: { type: String, required: true },
  private: { type: Boolean, default: false },
  code: { type: String, default: '' },
  users: [String],
  size: { type: Number, default: 2 },
  messages: [
    {
      content: { type: String },
      time: { type: Date },
      authorId: { type: String },
      authorName: { type: String },
    },
  ],
  usersInRoom: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  inviteKey: { type: String },
  createdBy: { type: Date, default: Date.now },
});

const Room = mongoose.model('room', roomSchema);
module.exports = Room;
