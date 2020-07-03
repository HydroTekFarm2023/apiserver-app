const mongoose = require('mongoose');

const sensor_info_schema = mongoose.Schema({
    Time: String,
    Sensor_1: String,
    Sensor_2: String
    });

module.exports = mongoose.model('temp_sensors_data', sensor_info_schema);