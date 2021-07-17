const http = require("http");
const app = require("./app");
var https = require('https');
var fs = require('fs');

const port = "3000";

const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
        throw error;
    }
};

const onListening = () => {
    console.log("Listening on port " + port);
}

if(process.env.NODE_ENV == "production") {
    console.log("Production Environment");
    let privateKey  = fs.readFileSync('app/certs/privkey.pem', 'utf8');
    let certificate = fs.readFileSync('app/certs/fullchain.pem', 'utf8');
    let credentials = {key: privateKey, cert: certificate};

    const server = https.createServer(credentials, app);

    server.on("error", onError);
    server.on("listening", onListening);
    server.listen(port);
} else {
    console.log("Local Dev Environment");

    const server = http.createServer(app);

    server.on("error", onError);
    server.on("listening", onListening);
    server.listen(port);    
}




