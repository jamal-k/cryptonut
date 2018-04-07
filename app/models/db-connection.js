const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://clockfifty:CSC309@ds133659.mlab.com:33659/heroku_t1spdpl5', (error) => {
  if (error) console.log(error);

  console.log('Database connection successful');

});
