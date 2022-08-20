const mongoose = require('mongoose');

const pestDetectNotification = mongoose.Schema({
    title: String,
    body: String,
    station: String,
    plant: String,
    image: String,
    timestamp: Number, 
    notificationType: {type: String, default: 'pest-detect'}, 
    isRead: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    deletedOn: {type: Number, default: null}
});

module.exports = mongoose.model('Pest-Detect-Notification', pestDetectNotification);