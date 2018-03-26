const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('./db-connection');

/**
 * Note that the database was loaded with data from a JSON file into a
 * collection called courses.
 */
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
  }
});

module.exports = mongoose.model('Wallet', walletSchema);
