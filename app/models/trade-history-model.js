const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('./db-connection');

/**
 * Note that the database was loaded with data from a JSON file into a
 * collection called courses.
 */
const tradehistorySchema = new Schema({
  type: {
    type: String,
    required: true,
    default: "trade"
  },
  time: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: String,
    required: true
  },
  balance: {
    type: String,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('TradeHistory', tradehistorySchema);
