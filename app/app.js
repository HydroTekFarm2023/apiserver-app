const express = require("express");
const DeviceSettings = require("./device-settings");
const PlantSettings = require("./plant");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();

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

app.post('/create-grow-room', (req, res, next) => {
    const deviceSettings = new DeviceSettings({
        name: req.body.name,
        deviceId: req.body.deviceId,
        type: "growroom",
        settings: req.body.settings
    });
    deviceSettings.save();
});

app.post('/create-system', (req, res, next) => {
    const deviceSettings = new DeviceSettings({
        name: req.body.name,
        deviceId: req.body.deviceId,
        type: "system",
        clusterName: req.body.clusterName,
        settings: req.body.settings
    });
    deviceSettings.save();
});

app.get('/device-settings/:deviceID', (req, res, next) => {
    DeviceSettings.findOne({ deviceID: req.params.deviceID })
    .then(document => {
        res.status(200).json(document);
    });
});

app.get('/device-settings', (req, res, next) => {
    DeviceSettings.find()
    .then(document => {
        res.status(200).json(document);
    });
});

app.put('/device-settings/:deviceID', (req, res, next) => {
    Device_Settings.updateOne({ _id: req.params.deviceID }, { $set: { settings: req.body } })
    .then(resData => {
        console.log(resData);
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