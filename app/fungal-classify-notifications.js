const mongoose = require('mongoose');

const fungalClassifyNotification = mongoose.Schema({
    title: String,
    body: String,
    station: String,
    plant: String,
    image: String,
    timestamp: String
}, {_id: false});

module.exports = mongoose.model('fungal-classify-Notification', fungalClassifyNotification);