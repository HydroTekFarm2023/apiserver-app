const mongoose = require('mongoose');

const testNotification = mongoose.Schema({
    title: String,
    body: String,
    device_id: String,
    plant: String,
    image: String,
    timestamp: Number, 
    isRead: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    deletedOn: {type: Number, default: null}
});

module.exports = mongoose.model('test-Notification', testNotification);