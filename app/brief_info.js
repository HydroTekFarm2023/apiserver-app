const mongoose = require('mongoose');

const sensors = mongoose.Schema({
    name: String,
    target_value: Number,
    desired_range_low: Number,
    desired_range_high: Number
});

const brief_info_schema = mongoose.Schema({
    name: String,
    growRoomVariables: [sensors],
    systems: [{
        name: String,
        systemVariables: [sensors]
    }]
});

module.exports = mongoose.model('Brief_Info', brief_info_schema);