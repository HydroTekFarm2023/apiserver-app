const mongoose = require('mongoose');

const phSensor = mongoose.Schema({
  monit_only: Boolean,
  control: {
    up_ctrl: Boolean,
    down_ctrl: Boolean,
    d_n_enabled: Boolean,
    day_tgt: Number,
    night_tgt: Number,
    tgt: Number,
    dose_time: Number,
    dose_interv: Number,
    pumps: {
      pump_1: {
      enabled: Boolean
      },
      pump_2: {
      enabled: Boolean
      }
    }
  },
  alarm_min: Number,
  alarm_max: Number
}, { _id: false });

const ecSensor = mongoose.Schema({
  monit_only: Boolean,
  control: {
    up_ctrl: Boolean,
    down_ctrl: Boolean,
    d_n_enabled: Boolean,
    day_tgt: Number,
    night_tgt: Number,
    tgt: Number,
    dose_time: Number,
    dose_interv: Number,
    pumps: {
      pump_1: {
        enabled: Boolean,
        value: Number
      },
      pump_2: { 
        enabled: Boolean,
        value: Number
      },
      pump_3: {
        enabled: Boolean,
        value: Number
      },
      pump_4: {
        enabled: Boolean,
        value: Number
      },
      pump_5: {
        enabled: Boolean,
        value: Number
      }
    }
  },
  alarm_min: Number,
  alarm_max: Number
}, { _id: false });

const waterTempSensor = mongoose.Schema({
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

const settings = mongoose.Schema({
  ph: phSensor,
  ec: ecSensor,
  water_temp: waterTempSensor
}, { _id: false });

const fertigationSystemSettings = mongoose.Schema({
    name: String, 
    type: String,
    settings: settings
}); 

module.exports = mongoose.model('fertigation_system_settings', fertigationSystemSettings);