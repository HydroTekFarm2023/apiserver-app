const mongoose = require('mongoose');
const { collection } = require('./brief_info');


const sensor = mongoose.Schema({
    name: String,
    value: Number
});

const sample = mongoose.Schema({
    time: Date,
    sensors:[sensor]
});


const sensor_info_schema = mongoose.Schema({
    grow_room_id: String,
    system_id: String,
    first_time: Date,
    last_time: Date,
    nsamples:Number,
    samples:[sample]
    },{collection: 'temp_sensors_data'});

module.exports = mongoose.model('temp_sensors_data', sensor_info_schema);