const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('./db-connection');

const achievementsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    default: "trade"
  },
  progress: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  achievement_id: {
    type: Schema.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Achievement', achievementsSchema);
