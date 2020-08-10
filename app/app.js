const express = require("express");
const Brief_Info = require("./brief_info");
const Grow_Room_Live_Data = require("./grow_room_live_data");
const Sensors_data = require("./sensors_data");

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
        name: req.body.name,
        growRoomVariables: req.body.growRoomVariables,
        systems: req.body.systems
    })
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

app.get('/sensors_data/:grow_room_id/:system_id/:sensor', (req, res, next) => {
    Sensors_data.aggregate(
        [
            // {$match:{'grow_room_id':'GrowRoom2','system_id':'system1'}},
            {$match:{'grow_room_id':req.params.grow_room_id,'system_id':req.params.system_id}},
            {$unwind:"$samples"},
            {$unwind:"$samples.sensors"},
            {$match:{'samples.sensors.name':req.params.sensor}},
            
            {$group:{_id:{time:'$samples.time',value:'$samples.sensors.value'}}},
            {$sort:{'_id.time':1}},
            //{$project:{'samples.time':{$gte:ISODate("2020-07-03T19:46:30.000Z")},'samples.sensors.value':1,}}
        ]).then(documents => {
        res.status(200).json({
            sensor_info: documents
        });
    })
});

// app.get('/get_all/:grow_room_id/:system_id/', (req, res, next) => {
//     Sensors_data.aggregate(
//         [
//             {$match:{'grow_room_id':req.params.grow_room_id,'system_id':req.params.system_id}},
//             {$unwind:"$samples"},
//             {$unwind:"$samples.sensors"},
//             {$group:{
//                 "_id":'$samples.time',
//                 // "timestamp":{'$addToSet':'$samples.time'},
//                 "sensors":{'$addToSet':'$samples.sensors'},
//             }},
//             {$sort:{'_id':1}},
//             //{$project:{_id:{$gte: ['$_id','2020-07-03 19:46:30']},'sensors':1}}
            
                        
//         ]).then(documents => {
//         res.status(200).json({
//             sensor_info: documents
//         });
//     })
// });



app.get('/get_all/:grow_room_id/:system_id/:start_date/:end_date', (req, res, next) => {
    //from=  '2020-07-03T19:46:00.000Z';
    //to = '2020-07-03T19:47:00.000Z';

    Sensors_data.aggregate(
        [
            {$match:{'grow_room_id':req.params.grow_room_id,'system_id':req.params.system_id}},
            {$unwind:"$samples"},
            {$unwind:"$samples.sensors"},
            {$match:{"samples.time":{$gte:new Date(req.params.start_date)}}},
            {$match:{"samples.time":{$lt:new Date(req.params.end_date)}}},
            {$group:{
                "_id":'$samples.time',
                
                "sensors":{'$addToSet':'$samples.sensors'},
            }},
            {$sort:{'_id':1}},
             
                        
        ]).then(documents => {
        res.status(200).json({
            sensor_info: documents
        });
    })
});



module.exports = app;