const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();

const FertigationSystemSettings = require("./fertigation-system-settings");
const ClimateControllerSettings = require("./climate-controller-settings");
const PlantSettings = require("./plant");
const SensorData = require("./sensor_data");

mongoose.connect('mongodb+srv://admin:Kansas2020!m@cluster0-x5wba.gcp.mongodb.net/test?retryWrites=true&w=majority').then(() => {
    console.log("connected to database");
}).catch((error) => {
    console.log(error);
    console.log("connection failed");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

app.post('/fertigation-system-settings/create', (req, res, next) => {
    const fertigationSystemSettings = new FertigationSystemSettings({
        name: req.body.name,
        type: "fertigation-system",
        settings: req.body.settings,
        camera: req.body.camera,
        device_started: req.body.device_started
    });
    fertigationSystemSettings.save().then(() => {
        res.status(201).json(fertigationSystemSettings);
    });
});

app.get('/fertigation-system-settings/find', (req, res, next) => {
    FertigationSystemSettings.find()
    .then(document => {
        res.status(200).json(document);
    });
});

app.get('/fertigation-system-settings/find/:id', (req, res, next) => {
    FertigationSystemSettings.findOne({ _id: req.params.id })
    .then(document => {
        res.status(200).json(document);
    });
});

app.put('/fertigation-system-settings/update/:id', (req, res, next) => {
    console.log(req.body.settings);
    FertigationSystemSettings.updateOne({ _id: req.params.id }, 
        { $set: { name: req.body.name, type: req.body.type, settings: req.body.settings, device_started: req.body.device_started, power_outlets: req.body.power_outlets, cameras: req.body.cameras } })
    .then(() => {
        res.status(200).json({
            message: "success"
        });
    });
});

app.post('/climate-controller-settings/create', (req, res, next) => {
    const climateControllerSettings = new ClimateControllerSettings({
        name: req.body.name,
        type: "climate-controller",
        settings: req.body.settings,
        device_started: req.body.device_started,
        cameras: req.body.cameras
    });
    climateControllerSettings.save().then(() => {
        res.status(201).json(climateControllerSettings);
    });
});

app.get('/climate-controller-settings/find/:id', (req, res, next) => {
    ClimateControllerSettings.findOne({ _id: req.params.id })
    .then(document => {
        res.status(200).json(document);
    });
});

app.get('/climate-controller-settings/find', (req, res, next) => {
    ClimateControllerSettings.find()
    .then(document => {
        res.status(200).json(document);
    });
});

app.put('/climate-controller-settings/update/:id', (req, res, next) => {
    ClimateControllerSettings.updateOne({ _id: req.params.id }, 
        { $set: { name: req.body.name, type: req.body.type, settings: req.body.settings, device_started: req.body.device_started, cameras: req.body.cameras } })
    .then(() => {
        res.status(200).json({
            message: "success"
        });
    });
});

app.get('/get-plants', (req, res, next) => {
    PlantSettings.find()
    .then(documents => {
        res.status(200).json(documents);
    })
});

app.post('/create-plant', (req, res, next) => {
    const plantSettings = new PlantSettings({
        name: req.body.name,
        settings: req.body.settings
    });
    plantSettings.save();
    res.status(200).json({
        message: "success"
    });
});


//Getting sensor data
app.get('/get_all/:topicID/:start_date/:end_date', (req, res, next) => {
    
    SensorData.aggregate([
        {$match:{'topicID':req.params.topicID}},
        {$unwind:"$samples"},
        {$unwind:"$samples.sensors"},
        {$match:{"samples.time":{$gte:new Date(req.params.start_date)}}},
        {$match:{"samples.time":{$lt:new Date(req.params.end_date)}}},
        {$group:{
            "_id":'$samples.time',
            "sensors":{'$addToSet':'$samples.sensors'},
        }},
        {$sort:{'_id':1}}                    
    ])
    .then(documents => {
        console.warn(documents.length)
        if(documents.length == 0){
            res.status(200).json({
                firstTimestamp: null,
                lastTimestamp: null,
                length: 0,
                sensor_info: []
            });
        }else{
            res.status(200).json({
                firstTimestamp: documents[0]._id,
                lastTimestamp: documents[documents.length - 1]._id,
                length: documents.length,
                sensor_info: documents
            });
        }
    })
});

//--------------------------generating sensor test data - do not use in actual server----------------------------------------


//ranges
//PH 4 - 7
//EC 1500 - 4000
//Temp 17 - 23

function generatephRandom(){
    var phMin = 4;
    var phMax = 7;
    var random = (Math.random() * (+phMax - +phMin) + +phMin).toFixed(1); 
    return random
}

function generateecRandom(){
    var phMin = 1500;
    var phMax = 4000;
    var random = (Math.random() * (+phMax - +phMin) + +phMin).toFixed(1); 
    return random
}

function generatetempRandom(){
    var phMin = 17;
    var phMax = 23;
    var random = (Math.random() * (+phMax - +phMin) + +phMin).toFixed(1); 
    return random
}

//saves one set of 5 data points beginning at firstTime_in, with intervalSec_in seconds between them, using topicID_in as the topicID.
//change nsamples to change number of points in a group
function generateOneSensorData(firstTime_in, intervalSec_in, topicID_in){
    date = new Date(firstTime_in);
    dateEnd = new Date(firstTime_in);
    dateEnd.setTime(dateEnd.getTime() + 4000 * intervalSec_in);
    const sensor_data = new SensorData({
        topicID: topicID_in,
        first_time: firstTime_in,
        last_time: dateEnd,
        nsamples: 5,
        samples:[
            {time:firstTime_in                                        ,sensors:[{name:'ph',value:generatephRandom()},{name:'ec',value:generateecRandom()},{name:'water temp',value:generatetempRandom()}]},
            {time:date.setTime(date.getTime() + 1000 * intervalSec_in),sensors:[{name:'ph',value:generatephRandom()},{name:'ec',value:generateecRandom()},{name:'water temp',value:generatetempRandom()}]},
            {time:date.setTime(date.getTime() + 1000 * intervalSec_in),sensors:[{name:'ph',value:generatephRandom()},{name:'ec',value:generateecRandom()},{name:'water temp',value:generatetempRandom()}]},
            {time:date.setTime(date.getTime() + 1000 * intervalSec_in),sensors:[{name:'ph',value:generatephRandom()},{name:'ec',value:generateecRandom()},{name:'water temp',value:generatetempRandom()}]},
            {time:date.setTime(date.getTime() + 1000 * intervalSec_in),sensors:[{name:'ph',value:generatephRandom()},{name:'ec',value:generateecRandom()},{name:'water temp',value:generatetempRandom()}]},
        ]
    });
    date.setTime(date.getTime() + 1000 * intervalSec_in);
    sensor_data.save();
}
//make below function really nice bc people use it for dummy data

//start, duration (s), interval, topicID, Json body?

//insert_fertigation_data, same with insert_climate_controller_data
//See creation of clim/fert systems above

//gen. a month of data (6 per minute = 8640 per day = 259200 per month (30 day month))
app.post('/insert_data/:topicID/:start_date/:interval/:duration',(req, res, next) =>{
    date = new Date(req.params.start_date);
    for(let i = 0; i < req.params.duration / req.params.interval; ++i){
        generateOneSensorData(date, req.params.interval, req.params.topicID);
    }
    res.status(200).json({
        message:"Successfully added data",
        topicID: req.params.topicID,
        data_groups: req.params.duration / req.params.interval
    });
});

module.exports = app;