const mongoose = require('mongoose');
const { collection } = require('./brief_info');


const sensor = mongoose.Schema({
    name: String,
    value: Number
});

const sample = mongoose.Schema({
    time: String,
    sensors:[sensor]
});


const sensor_info_schema = mongoose.Schema({
    grow_room_id: String,
    system_id: String,
    first_time: String,
    last_time: String,
    nsamples:Number,
    samples:[sample]
    },{collection: 'temp_sensors_data'});

module.exports = mongoose.model('temp_sensors_data', sensor_info_schema);