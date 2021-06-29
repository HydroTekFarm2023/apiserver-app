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
        res.status(200).json({
            sensorLess: new Date(req.params.start_date),
            sensorGreater: new Date(req.params.end_date),
            sensor_info: documents
        });
    })
});

//--------------------------generating sensor test data - do not use in actual server----------------------------------------

function generatephRandom(){
    var phMin = 6;
    var phMax = 9;
    var random = (Math.random() * (+phMax - +phMin) + +phMin).toFixed(1); 
    return random
}

function generateecRandom(){
    var phMin = 9;
    var phMax = 11;
    var random = (Math.random() * (+phMax - +phMin) + +phMin).toFixed(1); 
    return random
}

function generatetempRandom(){
    var phMin = 20;
    var phMax = 27;
    var random = (Math.random() * (+phMax - +phMin) + +phMin).toFixed(1); 
    return random
}

app.post('/insert_data',(req, res, next) =>{
    
    const sensor_data = new SensorData({
        topicID: "test0", //Fake ID for fake data
        firstTime:new Date('2020-09-01T10:00:00.000+00:00'),
        lastTime:new Date('2020-09-01T10:02:00.000+00:00'),
        nsamples: 5,
        samples:[
            {TimeStamp:new Date('2020-09-01T10:00:00.000+00:00'),sensors:[{name:'ph',value:generatephRandom()},{name:'ec',value:generateecRandom()},{name:'temp',value:generatetempRandom()}]},
            {TimeStamp:new Date('2020-09-01T10:00:30.000+00:00'),sensors:[{name:'ph',value:generatephRandom()},{name:'ec',value:generateecRandom()},{name:'temp',value:generatetempRandom()}]},
            {TimeStamp:new Date('2020-09-01T10:01:00.000+00:00'),sensors:[{name:'ph',value:generatephRandom()},{name:'ec',value:generateecRandom()},{name:'temp',value:generatetempRandom()}]},
            {TimeStamp:new Date('2020-09-01T10:01:30.000+00:00'),sensors:[{name:'ph',value:generatephRandom()},{name:'ec',value:generateecRandom()},{name:'temp',value:generatetempRandom()}]},
            {TimeStamp:new Date('2020-09-01T10:02:00.000+00:00'),sensors:[{name:'ph',value:generatephRandom()},{name:'ec',value:generateecRandom()},{name:'temp',value:generatetempRandom()}]},
        ]
    });
    sensor_data.save();
    res.status(200).json({
        message:"success"
    });
});




module.exports = app;