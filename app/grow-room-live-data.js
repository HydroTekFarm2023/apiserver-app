const mongoose = require('mongoose');

const grow_room_live_data = mongoose.Schema({
    name: String,
    samples: {
        timestamp: String,
        sensor_values: [{
            name: String,
            value: String
        }]
    }
});

module.exports = mongoose.model('Grow_Room_Live_Data', grow_room_live_data);