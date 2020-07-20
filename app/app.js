const express = require("express");
const Brief_Info = require("./brief_info");
const Grow_Room_Live_Data = require("./grow_room_live_data");
const Grow_Room_Settings = require("./grow_room_settings");
const System_Settings = require("./system_settings");

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


app.post('/brief_info', (req, res, next) => {
    const brief_info = new Brief_Info({
        name: req.body.name,
        growRoomVariables: req.body.growRoomVariables,
        systems: req.body.systems
    })
    console.log(req.body.systems);
    brief_info.save();
    res.status(200).json({
        message: "success"
    });
});

app.get('/brief_info', (req, res, next) => {
    Brief_Info.find()
    .then(documents => {
        res.status(200).json({
            brief_info: documents
        });
    });
});

app.post('/grow_room_settings/:growRoomID', (req, res, next) => {
    const grow_room_settings = new Grow_Room_Settings({
        growRoomID: req.params.growRoomID,
        settings: req.body
    });
    grow_room_settings.save();
    res.status(200).json({
        message: "success"
    });
});

app.get('/grow_room_settings/:growRoomID', (req, res, next) => {
    Grow_Room_Settings.findOne({ growRoomID: req.params.growRoomID })
    .then(document => {
        res.status(200).json(document);
    });
});

app.put('/grow_room_settings/:id', (req, res, next) => {
    Grow_Room_Settings.updateOne({ _id: req.params.id }, { $set: { settings: req.body } })
    .then(resData => {
        console.log(resData);
        res.status(200).json({
            message: "success"
        });
    });
});

app.post('/system_settings/:growRoomID/:systemID', (req, res, next) => {
    const system_settings = new System_Settings({
        growRoomID: req.params.growRoomID,
        systemID: req.params.systemID,
        settings: req.body
    });
    system_settings.save();
    res.status(200).json({
        message: "success"
    });
});

app.get('/system_settings/:growRoomID/:systemID', (req, res, next) => {
    System_Settings.findOne({ growRoomID: req.params.growRoomID, systemID: req.params.systemID })
    .then(document => {
        res.status(200).json(document);
    });
});

app.put('/system_settings/:id', (req, res, next) => {
    System_Settings.updateOne({ _id: req.params.id }, { $set: { settings: req.body } })
    .then(resData => {
        console.log(resData);
        res.status(200).json({
            message: "success"
        });
    });
});

module.exports = app;