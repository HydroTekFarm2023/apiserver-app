const express = require("express");
const Brief_Info = require("./brief_info");
const Grow_Room_Live_Data = require("./grow_room_live_data");

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
app.use(bodyParser.urlencoded({extended: false}))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});


app.post('/brief_info', (req, res, next) => {
    console.log(req.body);
    const brief_info = new Brief_Info({
        name: "Grow Room 1",
        growRoomVariables: [
            {
                name: "air temp",
                target_value: 55,
                desired_range_low: 44,
                desired_range_high: 66
            },
            {
                name: "humidity",
                target_value: 15,
                desired_range_low: 4,
                desired_range_high: 23
            }
        ],
        systems: [
            {
                name: "System 1",
                systemVariables: [
                    {
                        name: "ph",
                        target_value: 3,
                        desired_range_low: 2.2,
                        desired_range_high: 4.5
                    },
                    {
                        name: "ec",
                        target_value: 3.6,
                        desired_range_low: 2.1,
                        desired_range_high: 4.9
                    },
                    {
                        name: "water temp",
                        target_value: 33,
                        desired_range_low: 22,
                        desired_range_high: 45
                    }
                ]
            },
            {
                name: "System 2",
                systemVariables: [
                    {
                        name: "do",
                        target_value: 1,
                        desired_range_low: 0.2,
                        desired_range_high: 4.5
                    },
                    {
                        name: "ec",
                        target_value: 3.6,
                        desired_range_low: 2.1,
                        desired_range_high: 4.9
                    },
                    {
                        name: "water temp",
                        target_value: 35,
                        desired_range_low: 21,
                        desired_range_high: 45
                    },
                    {
                        name: "ph",
                        target_value: 3.5,
                        desired_range_low: 2.1,
                        desired_range_high: 4.5
                    }
                ]
            }
        ]
    });
    console.log(req.body.systems);
    brief_info.save();
    res.status(200).json({
        message: "here"
    });
});

app.get('/brief_info', (req, res, next) => {
    Brief_Info.find()
        .then(documents => {
            res.status(200).json({
                brief_info: documents
            });
        })
    
});
 
module.exports = app;