const mongoose = require('mongoose');

const settings = mongoose.Schema({
    alarm_min: Number,
    alarm_max: Number,
    target_value: Number,
    day_and_night: Boolean,
    day_target_value: Number,
    night_target_value: Number
}, { _id : false });

const sensor = mongoose.Schema({
    sensor_name: String,
    settings: settings
}, { _id : false });

const plant_settings = mongoose.Schema({
    name: String,
    sensor_array: [sensor]
});

module.exports = mongoose.model('Plant_Settings', plant_settings);