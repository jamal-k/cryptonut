const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Note that the database was loaded with data from a JSON file into a
 * collection called courses.
 */
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


mongoose.connect('mongodb://localhost:3001/CryptoNut', (error) => {
  if (error) console.log(error);

  console.log('Database connection successful');

});

module.exports = mongoose.model('user', userSchema);
