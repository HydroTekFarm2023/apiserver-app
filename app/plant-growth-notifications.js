const mongoose = require('mongoose');

const plantGrowthNotification = mongoose.Schema({
    title: String,
    body: String,
    device_id: String,
    plant: String,
    image: String,
    timestamp: Number, 
    notificationType: {type: String, default: 'plant-growth'},
    isRead: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    deletedOn: {type: Number, default: null}
});

module.exports = mongoose.model('plant-growth-Notification', plantGrowthNotification);