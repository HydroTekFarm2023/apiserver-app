const mongoose = require('mongoose');

const sensor = mongoose.Schema({
    name: String,
    target_value: Number,
    desired_range_low: Number,
    desired_range_high: Number
}, { strict : false, _id : false });

const grow_room_brief_info = mongoose.Schema({
    name: String,
    growRoomVariables: [sensor]
}, { strict : false, _id : false });

const system_brief_info = mongoose.Schema({
    name: String,
    systemVariables: [sensor]
}, { strict : false, _id : false });

const brief_info_schema = mongoose.Schema({
    name: String,
    growRoom: grow_room_brief_info,
    systems: [system_brief_info]
});

module.exports = mongoose.model('cluster', brief_info_schema);