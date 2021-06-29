const mongoose = require('mongoose');

const sensor = mongoose.Schema({
    name: String,
    value: Number
});

const sample = mongoose.Schema({
    time: Date,
    sensors:[sensor]
});

const sensor_data = mongoose.Schema({
    topicID: String,
    first_time: Date,
    last_time: Date,
    nsamples: Number,
    samples: [sample]
}, {collection: 'sensor_data'});

module.exports = mongoose.model('sensor_data', sensor_data);