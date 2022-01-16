const mongoose = require('mongoose');
const camera = require('./camera').schema;

const airTempSensor = mongoose.Schema({
    monit_only: Boolean,
    control: {
        up_ctrl: Boolean,
        down_ctrl: Boolean,
        tgt: Number
    },
    alarm_min: Number,
    alarm_max: Number
}, { _id: false });

const humiditySensor = mongoose.Schema({
    monit_only: Boolean,
    control: {
        up_ctrl: Boolean,
        down_ctrl: Boolean,
        tgt: Number
    },
    alarm_min: Number,
    alarm_max: Number
}, { _id: false });

const co2Sensor = mongoose.Schema({
    name: String,
    monit_only: Boolean,
    control: {
      up_ctrl: Boolean,
      tgt: Number
    },
    alarm_min: Number,
    alarm_max: Number
  }, { _id: false });

const settings = mongoose.Schema({
    air_temp: airTempSensor,
    humidity: humiditySensor,
    co2: co2Sensor
}, { _id: false });

const powerOutlets = mongoose.Schema({
    id: Number,
    name: String,
    logo: String  
  }, { _id: false });

const climateControllerSettings = mongoose.Schema({
    name: String, 
    type: String,
    settings: settings,
    topicID: String,
    power_outlets: [powerOutlets],
    cameras: [camera],
    device_started: Boolean,
    version: String
}); 

module.exports = mongoose.model('climate_controller_settings', climateControllerSettings);