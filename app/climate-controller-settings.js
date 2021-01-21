const mongoose = require('mongoose');

const climateControllerSettings = mongoose.Schema({
    name: String, 
    type: String,
    settings: settings
}); 

const settings = mongoose.Schema({
    air_temp: airTempSensor,
    humidity: humiditySensor
}, { _id: false });

const airTempSensor = mongoose.Schema({
    monit_only: Boolean,
    up_ctrl: Boolean,
    down_ctrl: Boolean,
    d_n_enabled: Boolean,
    day_tgt: Number,
    night_tgt: Number,
    tgt: Number,
    alarm_min: Number,
    alarm_max: Number
}, { _id: false });

const humiditySensor = mongoose.Schema({
    monit_only: Boolean,
    up_ctrl: Boolean,
    down_ctrl: Boolean,
    d_n_enabled: Boolean,
    day_tgt: Number,
    night_tgt: Number,
    tgt: Number,
    alarm_min: Number,
    alarm_max: Number
}, { _id: false });



module.exports = mongoose.model('ClimateControllerSettings', climateControllerSettings);