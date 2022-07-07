const mongoose = require('mongoose');

const pestDetectNotification = mongoose.Schema({
    title: String,
    body: String,
    station: String,
    plant: String,
    image: String,
    timestamp: String
}, {_id: false});

module.exports = mongoose.model('Pest-Detect-Notification', pestDetectNotification);