const mongoose = require('mongoose');

const StatusUpdateSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const StatusUpdate = mongoose.model('StatusUpdate', StatusUpdateSchema);

module.exports = StatusUpdate;