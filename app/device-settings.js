const mongoose = require('mongoose');

const settings = mongoose.Schema({}, { strict : false, _id: false });

const device_settings_data = mongoose.Schema({
    name: String,
    deviceId: String,
    type: String,
    settings: settings,
    version: Number
});

module.exports = mongoose.model('Device_Settings', device_settings_data);