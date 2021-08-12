const mongoose = require('mongoose');

const sensor = mongoose.Schema({
    name: String,
    value: Number
}, {_id: false});

const sample = mongoose.Schema({
    time: Date,
    sensors:[sensor]
}, {_id: false});

const sensor_data = mongoose.Schema({
    topicID: String,
    first_time: Date,
    last_time: Date,
    nsamples: Number,
    samples: [sample]
}, {collection: 'sensor_data', versionKey: false});//used for testing, isolate the main database; switch back to sensor_data when done
//versionKey is to disable the '__v' thing in the database objects added
module.exports = mongoose.model('sensor_data', sensor_data);