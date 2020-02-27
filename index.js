const fs = require('fs');
const credentials = { 
    key: fs.readFileSync('sslcert/wilsonle.me.key', 'utf8'), 
    cert: fs.readFileSync('sslcert/wilsonle.me.chained.crt', 'utf8') 
}

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const https = require("https").createServer(credentials,app);
const toHTTPS = require('./toHTTPS.js').redirectToHTTPS;

const io = require("socket.io")(https);


app.use(toHTTPS())

app.use(express.static('.')) // allow client to browse whole folder


// routing
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


//when a client connect, do
io.on('connection', function (socket) {
    console.log(socket.id + " has connected to the server");
    socket.on('disconnect', function () {
        console.log(socket.id + " has disconnected from the server");
    })
})



http.listen(80)
https.listen(443)