const express = require("express");
const Cluster = require("./clusters");
const Device_Settings = require("./device_settings");
const Plant_Settings = require("./plant");

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

app.get('/clusters', (req, res, next) => {
    console.log("hererer");
    Cluster.find()
    .then(documents => {
        res.status(200).json({
            brief_info: documents
        });
    });
});

app.post('/create_cluster', (req, res, next) => {
    const cluster = new Cluster({
        name: req.body.name,
        growRoom: null
    });
    cluster.save();
    res.status(200).json({
        message: "success"
    });
});

app.post('/create_grow_room', (req, res, next) => {
    const device_settings = new Device_Settings({
        name: req.body.name,
        type: "growroom",
        clusterName: req.body.cluster_name,
        settings: req.body.settings
    });
    device_settings.save();
    Cluster.updateOne({ name: req.body.cluster_name }, { $set: { growRoom: { name: req.body.name, growRoomVariables: req.body.brief_info }}})
    .then(resData => {
        console.log(resData);
        res.status(200).json({
            message: "success"
        });
    });
});

app.post('/create_system', (req, res, next) => {
    const device_settings = new Device_Settings({
        name: req.body.name,
        type: "system",
        clusterName: req.body.cluster_name,
        settings: req.body.settings
    });
    device_settings.save(function(err, doc){
        console.log(doc._id);
        Cluster.updateOne({ name: req.body.cluster_name }, { $push: { systems: { name: req.body.name, systemVariables: req.body.brief_info }}})
        .then(resData => {
            res.status(200).json({
                _id: doc._id
            });
        });
    });
});

app.get('/device_settings/:clusterName/:deviceName', (req, res, next) => {
    Device_Settings.findOne({ clusterName: req.params.clusterName, name: req.params.deviceName })
    .then(document => {
        res.status(200).json(document);
    });
});

app.put('/device_settings/:id', (req, res, next) => {
    Device_Settings.updateOne({ _id: req.params.id }, { $set: { settings: req.body } })
    .then(resData => {
        console.log(resData);
        res.status(200).json({
            message: "success"
        });
    });
});

app.get('/get_plants', (req, res, next) => {
    Plant_Settings.find()
    .then(documents => {
        res.status(200).json(documents);
    })
});

app.post('/create_plant', (req, res, next) => {
    const plant_settings = new Plant_Settings({
        name: req.body.name,
        settings: req.body.settings
    });
    plant_settings.save();
    res.status(200).json({
        message: "success"
    });
});

module.exports = app;