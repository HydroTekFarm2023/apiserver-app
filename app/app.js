const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();

const FertigationSystemSettings = require("./fertigation-system-settings");
const ClimateControllerSettings = require("./climate-controller-settings");
const PlantSettings = require("./plant");

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
        power_outlets: req.body.power_outlets,
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
        power_outlets: req.body.power_outlets,
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

module.exports = app;