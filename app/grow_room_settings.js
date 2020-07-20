const mongoose = require('mongoose');

const settings = mongoose.Schema({}, { strict : false, _id : false });

const grow_room_settings_data = mongoose.Schema({
    growRoomID: String,
    settings: settings
});

module.exports = mongoose.model('Growroom_Settings', grow_room_settings_data);