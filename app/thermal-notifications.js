const mongoose = require('mongoose');

const ThermalNotification = mongoose.Schema({
    title: String,
    body: String,
    station: String,
    plant: String,
    image: String,
    timestamp: Number,
    notificationType: {type: String, default: 'thermal'},
    isRead: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    deletedOn: {type: Number, default: null}
});

module.exports = mongoose.model('thermal-Notification', ThermalNotification);