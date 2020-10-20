const express = require("express");
const Grow_Room_Live_Data = require("./grow_room_live_data");
const Sensors_data = require("./sensors_data");
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

// app.get('/sensors_data/:grow_room_id/:system_id/:sensor', (req, res, next) => {
//     Sensors_data.aggregate(
//         [
//             // {$match:{'grow_room_id':'GrowRoom2','system_id':'system1'}},
//             {$match:{'grow_room_id':req.params.grow_room_id,'system_id':req.params.system_id}},
//             {$unwind:"$samples"},
//             {$unwind:"$samples.sensors"},
//             {$match:{'samples.sensors.name':req.params.sensor}},
            
//             {$group:{_id:{time:'$samples.time',value:'$samples.sensors.value'}}},
//             {$sort:{'_id.time':1}},
//             //{$project:{'samples.time':{$gte:ISODate("2020-07-03T20:46:30.000Z")},'samples.sensors.value':1,}}
//         ]).then(documents => {
//         res.status(200).json({
//             sensor_info: documents
//         });
//     })
// });




// app.get('/get_all/:grow_room_id/:system_id/:start_date/:end_date', (req, res, next) => {
//     //from=  '2020-07-03T20:46:00.000Z';
//     //to = '2020-07-03T20:47:00.000Z';

//     Sensors_data.aggregate(
//         [
//             {$match:{'grow_room_id':req.params.grow_room_id,'system_id':req.params.system_id}},
//             {$unwind:"$samples"},
//             {$unwind:"$samples.sensors"},
//             {$match:{"samples.time":{$gte:new Date(req.params.start_date)}}},
//             {$match:{"samples.time":{$lt:new Date(req.params.end_date)}}},
//             {$group:{
//                 "_id":'$samples.time',
                
//                 "sensors":{'$addToSet':'$samples.sensors'},
//             }},
//             {$sort:{'_id':1}},
             
                        
//         ]).then(documents => {
//         res.status(200).json({
//             sensor_info: documents
//         });
//     })
// });

app.get('/get_all/:clusterName/:name/:start_date/:end_date', (req, res, next) => {

    Sensors_data.aggregate(
        [
            {$match:{'clusterName':req.params.clusterName,'name':req.params.name}},
            {$unwind:"$samples"},
            {$unwind:"$samples.sensors"},
            {$match:{"samples.TimeStamp":{$gte:new Date(req.params.start_date)}}},
            {$match:{"samples.TimeStamp":{$lt:new Date(req.params.end_date)}}},
            {$group:{
                "_id":'$samples.TimeStamp',
                
                "sensors":{'$addToSet':'$samples.sensors'},
            }},
            {$sort:{'_id':1}},
             
                        
        ]).then(documents => {
        res.status(200).json({
            sensor_info: documents
        });
    })
});

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
    
    const sensor_data = new Sensors_data({
        clusterName: 'Cluster 1',
        type:'growRoom',
        name:'Grow Room 1',
        firstTime:new Date('2020-09-01T10:00:00.000+00:00'),
        lastTime:new Date('2020-09-01T10:02:00.000+00:00'),
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