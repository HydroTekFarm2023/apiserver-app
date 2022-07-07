const mongoose = require('mongoose');

const ThermalNotification = mongoose.Schema({
    title: String,
    body: String,
    station: String,
    plant: String,
    image: String,
    timestamp: String
}, {_id: false});

module.exports = mongoose.model('thermal-Notification', ThermalNotification);