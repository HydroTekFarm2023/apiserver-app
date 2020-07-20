const mongoose = require('mongoose');

const settings = mongoose.Schema({}, { strict : false, _id: false });

const system_settings_data = mongoose.Schema({
    growRoomID: String,
    systemID: String,
    settings: settings
});

module.exports = mongoose.model('Systems_Settings', system_settings_data);