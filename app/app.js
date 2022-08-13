const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const useState = require("usestate");
const app = express();

const FertigationSystemSettings = require("./fertigation-system-settings");
const ClimateControllerSettings = require("./climate-controller-settings");
const PlantSettings = require("./plant");
const SensorData = require("./sensor_data");
const PestDetectNotifications = require("./pest-detect-notifications");
const FungalClassifyNotifications = require("./fungal-classify-notifications");
const PlantGrowthNotifications = require("./plant-growth-notifications");
const ThermalNotifications = require("./thermal-notifications");
const TestNotifications = require("./test-notifications");

const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PWD = process.env.MONGO_PWD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

mongoose
  .connect(
    "mongodb+srv://" +
      MONGO_USER +
      ":" +
      MONGO_PWD +
      "@" +
      MONGO_HOST +
      "/" +
      MONGO_DB_NAME +
      "?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to DB: " + MONGO_DB_NAME);
  })
  .catch((error) => {
    console.log("Connection Failed");
    console.log(error);
  });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// returnNotifications("pest-detect", 0, 1);

app.post("/fertigation-system-settings/create", (req, res, next) => {
  const fertigationSystemSettings = new FertigationSystemSettings({
    name: req.body.name,
    type: "fertigation-system",
    settings: req.body.settings,
    topicID: req.body.topicID,
    camera: req.body.camera,
    power_outlets: req.body.power_outlets,
    device_started: req.body.device_started,
  });
  fertigationSystemSettings.save().then(() => {
    res.status(201).json(fertigationSystemSettings);
  });
});

app.get("/fertigation-system-settings/find", (req, res, next) => {
  FertigationSystemSettings.find().then((document) => {
    res.status(200).json(document);
  });
});

app.get("/fertigation-system-settings/find/:id", (req, res, next) => {
  FertigationSystemSettings.findOne({ _id: req.params.id }).then((document) => {
    res.status(200).json(document);
  });
});

app.put("/fertigation-system-settings/update/:id", (req, res, next) => {
  FertigationSystemSettings.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        type: req.body.type,
        settings: req.body.settings,
        device_started: req.body.device_started,
        power_outlets: req.body.power_outlets,
        cameras: req.body.cameras,
      },
    }
  ).then(() => {
    res.status(200).json({
      message: "success",
    });
  });
});

app.put("/fertigation-system-settings/device-started/:id", (req, res, next) => {
  console.log(req.body);
  FertigationSystemSettings.updateOne(
    { _id: req.params.id },
    { $set: { device_started: req.body.device_started } }
  ).then(() => {
    res.status(200).json({
      message: "success",
    });
  });
});

app.post("/climate-controller-settings/create", (req, res, next) => {
  console.log("asd");
  const climateControllerSettings = new ClimateControllerSettings({
    name: req.body.name,
    type: "climate-controller",
    settings: req.body.settings,
    topicID: req.body.topicID,
    device_started: req.body.device_started,
    power_outlets: req.body.power_outlets,
    cameras: req.body.cameras,
  });
  climateControllerSettings.save().then(() => {
    res.status(201).json(climateControllerSettings);
  });
});

app.get("/climate-controller-settings/find/:id", (req, res, next) => {
  ClimateControllerSettings.findOne({ _id: req.params.id }).then((document) => {
    res.status(200).json(document);
  });
});

app.get("/climate-controller-settings/find", (req, res, next) => {
  ClimateControllerSettings.find().then((document) => {
    res.status(200).json(document);
  });
});

app.put("/climate-controller-settings/update/:id", (req, res, next) => {
  console.log(req.body);
  ClimateControllerSettings.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        type: req.body.type,
        settings: req.body.settings,
        power_outlets: req.body.power_outlets,
        device_started: req.body.device_started,
        cameras: req.body.cameras,
      },
    }
  ).then(() => {
    res.status(200).json({
      message: "success",
    });
  });
});

app.put("/climate-controller-settings/device-started/:id", (req, res, next) => {
  console.log(req.body);
  ClimateControllerSettings.updateOne(
    { _id: req.params.id },
    { $set: { device_started: req.body.device_started } }
  ).then(() => {
    res.status(200).json({
      message: "success",
    });
  });
});

app.get("/plants", (req, res, next) => {
  PlantSettings.find().then((documents) => {
    res.status(200).json(documents);
  });
});

app.get("/plants/:plantName", (req, res, next) => {
  PlantSettings.findOne({
    name: req.params.plantName,
  }).then((documents) => {
    res.status(200).json(documents);
  });
});

app.post("/create-plant", (req, res, next) => {
  const plantSettings = new PlantSettings({
    name: req.body.name,
    sensor_array: req.body.sensor_array,
  });
  plantSettings.save();
  res.status(200).json({
    message: "success",
  });
});

//Getting sensor data
//topicID: 5-digit topic ID for Device
//start_date/end_date: in ISO format, UTC time (?). In format like (2020-07-07T10:00:00.000Z)
app.get("/get_sensor_data/:topicID/:start_date/:end_date", (req, res, next) => {
  let startTime = new Date();
  SensorData.aggregate([
    { $match: { topicID: req.params.topicID } },
    { $unwind: "$samples" },
    { $unwind: "$samples.sensors" }, //Think this opens the objects so you can match conditions on sub-objects...?
    { $match: { "samples.time": { $gte: new Date(req.params.start_date) } } },
    { $match: { "samples.time": { $lt: new Date(req.params.end_date) } } },
    {
      $group: {
        _id: "$samples.time",
        sensors: { $addToSet: "$samples.sensors" },
      },
    },
    { $sort: { _id: 1 } },
  ])
    .allowDiskUse(true)
    .then((documents) => {
      console.warn(documents.length);
      if (documents.length == 0) {
        //No result
        res.status(200).json({
          firstTimestamp: null,
          lastTimestamp: null,
          length: 0,
          sensor_info: [],
        });
      } else {
        let endTime = new Date();
        console.log(
          "Aggregation: took",
          endTime.getTime() - startTime.getTime(),
          "millis for",
          documents.length,
          "entries"
        );
        res.status(200).json({
          //Success!
          firstTimestamp: documents[0]._id,
          lastTimestamp: documents[documents.length - 1]._id,
          length: documents.length,
          sensor_info: documents,
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

//removing sensor test data by TopicID -- Do NOT use in actual server
app.post("/remove_all_sensor_data/:topicID", (req, res, next) => {
  SensorData.deleteMany({ topicID: req.params.topicID })
    .then(function () {
      console.log("Deleted all data for ", req.params.topicID);
      res.status(200).json({
        message: "Successfully removed all data for topic ID",
        topicID: req.params.topicID,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

//getting notification data

//endpoint for getting test notification data
app.get("/notifications/test/:time/:limit", (req, res, next) => {
  const timestamp = parseInt(req.params.time);
  const limit = parseInt(req.params.limit);
  // console.log(limit);
  if (timestamp == 0) {
    TestNotifications.find()
      .sort({ timestamp: -1 })
      .limit(limit) //add the sort method here as well once error resolved
      .then((documents) => {
        res.status(200).json(documents);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  } else {
    TestNotifications.find({ timestamp: { $gte: timestamp } })
      .countDocuments()
      .then((skip) => {
        // console.log(skip);
        TestNotifications.find()
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit) //problem with the sorting, everything else is absolutely fine
          .then((documents) => {
            res.status(200).json(documents);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
});

//endpoint for getting all notifications
//parameters: time (timestamp/0 for first n set of notifications), limit (number of notifications to return after specified timestamp)

app.get("/notifications/get/:time/:limit", (req, res, next) => {
  const timestamp = parseInt(req.params.time);
  const limit = parseInt(req.params.limit);
  const notificationSchemas = ['pest-detect','thermal', 'fungal-classify', 'plant-growth'];
  var notifications = new Array();
  var index;
  var promises = [];
  var result = [];

  for(notificationSchema of notificationSchemas){
    NotificationSchema = getNotificationSchema(notificationSchema);
    if(NotificationSchema == null){
      res.status(400).json({ error: "Path not found: Invalid notification type" });
      return;
    }
     
    if (timestamp == 0) {
      var promise = NotificationSchema.find()
        .sort({ timestamp: -1 })
        .limit(limit);
        promises.push(promise);
    } else {
        var promise = NotificationSchema.find({ timestamp: { $lt: timestamp, $gt:0 } })
          .sort({ timestamp: -1 })
          .limit(limit);
          promises.push(promise); 
    }
    
  };
  Promise.all(promises).then((values => {
    for(i in values){
      for(j in values[i]){
        notifications.push(values[i][j]);
      }
    }
    notifications.sort(function(a, b){
      return b.timestamp - a.timestamp;
    });
    result = notifications.slice(0, limit);

    res.status(200).json(result);
  }));
  
});

//test code for getting notifications from a single collection

// app.get("/notifications/:type/:time/:limit", (req, res, next) => {
//   const timestamp = parseInt(req.params.time);
//   const limit = parseInt(req.params.limit);
//   const notificationType = req.params.type;
//   var NotificationSchema;

//   NotificationSchema = getNotificationSchema(notificationType);
//   if(NotificationSchema == null){
//     res.status(400).json({ error: "Path not found: Invalid notification type" });
//     return;
//   }

//   if (timestamp == 0) {
//     NotificationSchema.find()
//       .sort({ timestamp: -1 })
//       .limit(limit) 
//       .then((documents) => {
//         res.status(200).json(documents);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.status(500).json({ error: err });
//       });
//   } else {
//     NotificationSchema.find({ timestamp: { $gte: timestamp } })
//       .countDocuments()
//       .then((skip) => {
//         NotificationSchema.find()
//           .sort({ timestamp: -1 })
//           .skip(skip)
//           .limit(limit) 
//           .then((documents) => {
//             res.status(200).json(documents);
//           })
//           .catch((err) => {
//             console.log(err);
//             res.status(500).json({ error: err });
//           });
//       })
//       .catch((err) => {
//         console.log(err);
//         res.status(500).json({ error: err });
//       });
//   }
// });

// code for updating test notification variables from a single collection

app.put("/notifications/test/read/:id", (req, res, next) => {
  TestNotifications.updateOne(
    { _id: req.params.id },
    { $set: { isRead: true } }
  ).then(() => {
    res.status(200).json({
      message: "Read status successfully updated",
    });
  });
});

app.put("/notifications/test/delete/:id", (req, res, next) => {
  TestNotifications.updateOne(
    { _id: req.params.id },
    { $set: { isDeleted: true, deletedOn: Date.now() } }
  ).then(() => {
    res.status(200).json({
      message: "Deleted status successfully updated",
    });
  });
});

//code for updating notifications variables from a single collection

app.put("/notifications/:type/read/:id", (req, res, next) => {
  const notificationType = req.params.type;
  var NotificationSchema;

  NotificationSchema = getNotificationSchema(notificationType);
  if(NotificationSchema == null){
    res.status(400).json({ error: "Path not found: Invalid notification type" });
    return;
  }

  NotificationSchema.updateOne(
    { _id: req.params.id },
    { $set: { isRead: true } }
  ).then(() => {
    res.status(200).json({
      message: "Read status successfully updated",
    });
  });
});

app.put("/notifications/:type/delete/:id", (req, res, next) => {
  const notificationType = req.params.type;
  var NotificationSchema;

  NotificationSchema = getNotificationSchema(notificationType);
  if(NotificationSchema == null){
    res.status(400).json({ error: "Path not found: Invalid notification type" });
    return;
  }

  NotificationSchema.updateOne(
    { _id: req.params.id },
    { $set: { isDeleted: true, deletedOn: Date.now() } }
  ).then(() => {
    res.status(200).json({
      message: "Deleted status successfully updated",
    });
  });
});

//test data until the AI team implements the required updates

//--------------------------generating sensor test data - do not use in actual server----------------------------------------

//ranges
//PH 4 - 7
//EC 1500 - 4000
//Temp 17 - 23
//AirTemp 20 - 30
//Humidity 40 - 60 (no units in backend)
//CO2 1000 - 1300

function generatephRandom() {
  var phMin = 4;
  var phMax = 7;
  var random = (Math.random() * (+phMax - +phMin) + +phMin).toFixed(1);
  return random;
}

function generateecRandom() {
  var phMin = 1500;
  var phMax = 4000;
  var random = (Math.random() * (+phMax - +phMin) + +phMin).toFixed(1);
  return random;
}

function generatetempRandom() {
  var phMin = 17;
  var phMax = 23;
  var random = (Math.random() * (+phMax - +phMin) + +phMin).toFixed(1);
  return random;
}

function generateAirTempRandom() {
  var phMin = 20;
  var phMax = 30;
  var random = (Math.random() * (+phMax - +phMin) + +phMin).toFixed(1);
  return random;
}

//Humidity: No percentage units in back end!
function generateHumidityRandom() {
  var phMin = 40;
  var phMax = 60;
  var random = (Math.random() * (+phMax - +phMin) + +phMin).toFixed(1);
  return random;
}

function generateCO2Random() {
  var phMin = 1000;
  var phMax = 1300;
  var random = (Math.random() * (+phMax - +phMin) + +phMin).toFixed(1);
  return random;
}

//This has sensor data for *Fertigation systems*.
//saves one set of 5 data points beginning at firstTime_in, with intervalSec_in seconds between them, using topicID_in as the topicID.
//change nsamples to change number of points in a group
function generateOneSensorDataFert(firstTime_in, intervalSec_in, topicID_in) {
  date = new Date(firstTime_in);
  dateEnd = new Date(firstTime_in);
  dateEnd.setTime(dateEnd.getTime() + 4000 * intervalSec_in);
  const sensor_data = new SensorData({
    topicID: topicID_in,
    first_time: firstTime_in,
    last_time: dateEnd,
    nsamples: 5,
    samples: [
      {
        time: firstTime_in,
        sensors: [
          { name: "ph", value: generatephRandom() },
          { name: "ec", value: generateecRandom() },
          { name: "water_temp", value: generatetempRandom() },
        ],
      },
      {
        time: date.setTime(date.getTime() + 1000 * intervalSec_in),
        sensors: [
          { name: "ph", value: generatephRandom() },
          { name: "ec", value: generateecRandom() },
          { name: "water_temp", value: generatetempRandom() },
        ],
      },
      {
        time: date.setTime(date.getTime() + 1000 * intervalSec_in),
        sensors: [
          { name: "ph", value: generatephRandom() },
          { name: "ec", value: generateecRandom() },
          { name: "water_temp", value: generatetempRandom() },
        ],
      },
      {
        time: date.setTime(date.getTime() + 1000 * intervalSec_in),
        sensors: [
          { name: "ph", value: generatephRandom() },
          { name: "ec", value: generateecRandom() },
          { name: "water_temp", value: generatetempRandom() },
        ],
      },
      {
        time: date.setTime(date.getTime() + 1000 * intervalSec_in),
        sensors: [
          { name: "ph", value: generatephRandom() },
          { name: "ec", value: generateecRandom() },
          { name: "water_temp", value: generatetempRandom() },
        ],
      },
    ],
  });
  date.setTime(date.getTime() + 1000 * intervalSec_in);
  sensor_data.save();
}

//This has sensor data for *Climate control systems*.
//saves one set of 5 data points beginning at firstTime_in, with intervalSec_in seconds between them, using topicID_in as the topicID.
//change nsamples to change number of points in a group
function generateOneSensorDataClim(firstTime_in, intervalSec_in, topicID_in) {
  date = new Date(firstTime_in);
  dateEnd = new Date(firstTime_in);
  dateEnd.setTime(dateEnd.getTime() + 4000 * intervalSec_in);
  const sensor_data = new SensorData({
    topicID: topicID_in,
    first_time: firstTime_in,
    last_time: dateEnd,
    nsamples: 5,
    samples: [
      {
        time: firstTime_in,
        sensors: [
          { name: "air_temp", value: generateAirTempRandom() },
          { name: "humidity", value: generateHumidityRandom() },
          { name: "co2", value: generateCO2Random() },
        ],
      },
      {
        time: date.setTime(date.getTime() + 1000 * intervalSec_in),
        sensors: [
          { name: "air_temp", value: generateAirTempRandom() },
          { name: "humidity", value: generateHumidityRandom() },
          { name: "co2", value: generateCO2Random() },
        ],
      },
      {
        time: date.setTime(date.getTime() + 1000 * intervalSec_in),
        sensors: [
          { name: "air_temp", value: generateAirTempRandom() },
          { name: "humidity", value: generateHumidityRandom() },
          { name: "co2", value: generateCO2Random() },
        ],
      },
      {
        time: date.setTime(date.getTime() + 1000 * intervalSec_in),
        sensors: [
          { name: "air_temp", value: generateAirTempRandom() },
          { name: "humidity", value: generateHumidityRandom() },
          { name: "co2", value: generateCO2Random() },
        ],
      },
      {
        time: date.setTime(date.getTime() + 1000 * intervalSec_in),
        sensors: [
          { name: "air_temp", value: generateAirTempRandom() },
          { name: "humidity", value: generateHumidityRandom() },
          { name: "co2", value: generateCO2Random() },
        ],
      },
    ],
  });
  date.setTime(date.getTime() + 1000 * intervalSec_in);
  sensor_data.save();
}

function generateOneTestNotification() {
  const testNotifications = new TestNotifications({
    title: "test-notification-v2",
    body: "a test notification",
    device_id: "Hydrotek-Calgary",
    plant: "Money plany",
    image: "no image yet",
    timestamp: Date.now(),
    // isRead: false,
    // isDeleted: false,
    // deletedOn: null
  });
  testNotifications.save();
  console.log(testNotifications);
}

function generateOneThermalNotification() {
  const thermalNotifications = new ThermalNotifications({
    title: "thermal-notification",
    body: "a test notification",
    device_id: "Hydrotek-Calgary",
    plant: "Money plany",
    image: "no image yet",
    timestamp: Date.now(),
    // isRead: false,
    // isDeleted: false,
    // deletedOn: null
  });
  thermalNotifications.save();
  console.log(thermalNotifications);
}

function generateOnePlantGrowthNotification() {
  const pgNotifications = new PlantGrowthNotifications({
    title: "Plant Growth Alert at hydrotek-farm for lettuce",
    body: "a test notification",
    device_id: "Hydrotek-Calgary",
    plant: "Money plany",
    image: "hydrotekai/HeightAnalysis/NFTtest2.jpg",
    timestamp: Date.now(),
    // isRead: false,
    // isDeleted: false,
    // deletedOn: null
  });
  pgNotifications.save();
  console.log(pgNotifications);
}

function generateOnePestDetectNotification() {
  const pdNotifications = new PestDetectNotifications({
    title: "Pest Detected at hydrotek-farm",
    body: "a test notification",
    device_id: "Hydrotek-Calgary",
    plant: "Money plany",
    image:
      "hydrotek-2022/images/mumbai-hydrotek-farm/station-1/daily-rgb-output-images/t3-output.jpg",
    timestamp: Date.now(),
    // isRead: false,
    // isDeleted: false,
    // deletedOn: null
  });
  pdNotifications.save();
  console.log(pdNotifications);
}

function generateOneFungalClassifyNotification() {
  const fcNotifications = new FungalClassifyNotifications({
    title: "Fungus Detected at hydrotek-farm",
    body: "a test notification",
    device_id: "Hydrotek-Calgary",
    plant: "Money plany",
    image:
      "hydrotek-2022/images/mumbai-hydrotek-farm/station-1/daily-rgb-output-images/tomato-11-output.jpg",
    timestamp: Date.now(),
    // isRead: false,
    // isDeleted: false,
    // deletedOn: null
  });
  fcNotifications.save();
  console.log(fcNotifications);
}

//function to provide appropriate notification schema

function getNotificationSchema(notificationType) {
  var NotificationSchema;

  if (notificationType == "fungal-classify") {
    NotificationSchema = FungalClassifyNotifications;
  } 
  else if (notificationType == "plant-growth") {
    NotificationSchema = PlantGrowthNotifications;
  } 
  else if (notificationType == "thermal") {
    NotificationSchema = ThermalNotifications;
  } 
  else if (notificationType == "pest-detect") {
    NotificationSchema = PestDetectNotifications;
  } 
  else {
    NotificationSchema = null;
  }

  return NotificationSchema;
}

//make below function really nice bc people use it for dummy data

//generates big amounts of data based on parameters:
//topicID: 5-digit topic ID
//start_date: Starting date in UTC, ISO format: like (2020-07-07T10:00:00.000Z)
//interval: Time between each data point (in seconds)
//duration: Total time of sensor data to generate (in seconds) - if interval = 10s and duration = 30s, there would be 3 groups of data

app.post(
  "/insert_fertigation_data/:topicID/:start_date/:interval/:duration",
  (req, res, next) => {
    date = new Date(req.params.start_date); //this date is passed to the helper function as a *reference*. Therefore, all Date operations are done inside the helper functions.
    for (let i = 0; i < req.params.duration / req.params.interval; ++i) {
      generateOneSensorDataFert(date, req.params.interval, req.params.topicID);
    }
    res.status(200).json({
      message: "Successfully added Fertigation data",
      topicID: req.params.topicID,
      data_groups: req.params.duration / req.params.interval,
    });
  }
);

app.post(
  "/insert_climate_controller_data/:topicID/:start_date/:interval/:duration",
  (req, res, next) => {
    date = new Date(req.params.start_date); //this date is passed to the helper function as a *reference*. Therefore, all Date operations are done inside the helper functions.
    for (let i = 0; i < req.params.duration / req.params.interval; ++i) {
      generateOneSensorDataClim(date, req.params.interval, req.params.topicID);
    }
    res.status(200).json({
      message: "Successfully added Climate Controller data",
      topicID: req.params.topicID,
      data_groups: req.params.duration / req.params.interval,
    });
  }
);

// endpoints to generate dummy data for notification collections
app.post("/test-notifications/create", (req, res, test) => {
  generateOneTestNotification();
  res.status(201).json({ message: " Test Notification added successfully" });
});

app.post("/thermal-notifications/create", (req, res, test) => {
  generateOneThermalNotification();
  res.status(201).json({ message: "Thermal Notification added successfully" });
});

app.post("/plant-growth/create", (req, res, test) => {
  generateOnePlantGrowthNotification();
  res
    .status(201)
    .json({ message: "Plant Growth Notification added successfully" });
});

app.post("/pest-detect/create", (req, res, test) => {
  generateOnePestDetectNotification();
  res
    .status(201)
    .json({ message: "Pest Detect Notification added successfully" });
});

app.post("/fungal-classify/create", (req, res, test) => {
  generateOneFungalClassifyNotification();
  res
    .status(201)
    .json({ message: "Fungal Classify Notification added successfully" });
});

module.exports = app;
