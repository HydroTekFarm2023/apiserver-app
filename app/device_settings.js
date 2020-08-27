const mongoose = require('mongoose');

const settings = mongoose.Schema({}, { strict : false, _id: false });

const device_settings_data = mongoose.Schema({
    name: String,
    type: String,
    clusterName: String,
    settings: settings
});

module.exports = mongoose.model('Device_Settings', device_settings_data);