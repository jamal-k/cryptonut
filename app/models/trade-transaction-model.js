const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('./db-connection');

/**
 * Note that the database was loaded with data from a JSON file into a
 * collection called courses.
 */
const tradetransactionSchema = new Schema({
  wallet: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: "trade"
  },
  date: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  balance: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('TradeTransaction', tradetransactionSchema);
