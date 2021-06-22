const mongoose = require('mongoose');
const camera = require('./camera').schema;

const phSensor = mongoose.Schema({
  name: String,
  monit_only: Boolean,
  control: {
    d_n_enabled: Boolean,
    day_tgt: Number,
    night_tgt: Number,
    tgt: Number,
    dose_time: Number,
    dose_interv: Number,
    up_ctrl: Boolean,
    down_ctrl: Boolean
  },
  alarm_min: Number,
  alarm_max: Number
}, { _id: false });

const ecSensor = mongoose.Schema({
  name: String,
  monit_only: Boolean,
  control: {
    d_n_enabled: Boolean,
    day_tgt: Number,
    night_tgt: Number,
    tgt: Number,
    dose_time: Number,
    dose_interv: Number,
    pumps: {
      pump_1: Number,
      pump_2: Number,
      pump_3: Number,
      pump_4: Number,
      pump_5: Number
    }
  },
  alarm_min: Number,
  alarm_max: Number
}, { _id: false });

const waterTempSensor = mongoose.Schema({
  name: String,
  monit_only: Boolean,
  control: {
    up_ctrl: Boolean,
    down_ctrl: Boolean,
    d_n_enabled: Boolean,
    day_tgt: Number,
    night_tgt: Number,
    tgt: Number
  },
  alarm_min: Number,
  alarm_max: Number
}, { _id: false });

const reservoirSettings = mongoose.Schema({
  reservoir_size: Number,
  is_control: Boolean,
  water_replacement_interval: Number
}, { _id: false });

const growLightsPowerOutlets = mongoose.Schema({
  name: String,
  is_control: Boolean
}, { _id: false });

const growLightsSettings = mongoose.Schema({
  lights_on: String,
  lights_off: String,
  power_outlets: [growLightsPowerOutlets]
}, { _id: false });

const irrigationSettings = mongoose.Schema({
  on_interval: Number,
  off_interval: Number,
}, { _id: false });

const settings = mongoose.Schema({
  ph: phSensor,
  ec: ecSensor,
  water_temp: waterTempSensor,
  grow_lights: growLightsSettings,
  irrigation: irrigationSettings,
  reservoir: reservoirSettings
}, { _id: false });

const powerOutlets = mongoose.Schema({
  id: Number,
  name: String,
  logo: String  
}, { _id: false });

const fertigationSystemSettings = mongoose.Schema({
    name: String, 
    type: String,
    settings: settings,
    topicID: String,
    power_outlets: [powerOutlets],
    cameras: [camera],
    device_started: Boolean
}); 

module.exports = mongoose.model('fertigation_system_settings', fertigationSystemSettings);