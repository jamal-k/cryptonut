const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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


mongoose.connect('mongodb://localhost:3001/CryotoNut', (error) => {
  if (error) console.log(error);

  console.log('Database connection successful');

});

module.exports = mongoose.model('Wallet', walletSchema);
