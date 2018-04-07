const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('./db-connection');

const walletSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    required: true
  },
  challenge_currency: {
    type: String,
    required: false,
    default: ""
  }
});

module.exports = mongoose.model('Wallet', walletSchema);
