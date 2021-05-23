const mongoose = require('mongoose');

const camera = mongoose.Schema({
    name: String,
    url: String
  }, { _id: false });

module.exports = mongoose.model('Camera', camera);