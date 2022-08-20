const mongoose = require('mongoose');

const fungalClassifyNotification = mongoose.Schema({
    title: String,
    body: String,
    station: String,
    plant: String,
    image: String,
    timestamp: Number, 
    notificationType: {type: String, default: 'fungal-classify'},
    isRead: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    deletedOn: {type: Number, default: null}
});

module.exports = mongoose.model('fungal-classify-Notification', fungalClassifyNotification);