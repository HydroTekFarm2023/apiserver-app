const mongoose = require('mongoose');

const plantGrowthNotification = mongoose.Schema({
    title: String,
    body: String,
    device_id: String,
    plant: String,
    image: String,
    timestamp: String
}, {_id: false});

module.exports = mongoose.model('plant-growth-Notification', plantGrowthNotification);