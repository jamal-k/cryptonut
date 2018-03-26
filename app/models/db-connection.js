const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:3001/CryptoNut', (error) => {
  if (error) console.log(error);

  console.log('Database connection successful');

});
