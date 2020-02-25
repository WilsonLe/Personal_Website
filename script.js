var express = require("express");
var app = express();
var http = require("http").createServer(app);
var https = require("https");
var io = require("socket.io")(http);
var fs = require('fs');




//create route
app.use(express.static('.')) //allow client to browse whole folder

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

//create redir http to https
var privateKey  = fs.readFileSync('sslcert/wilsonle.me.key', 'utf8');
var certificate = fs.readFileSync('sslcert/wilsonle.me.chained.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };
const toHTTPS = require('./toHTTPS.js').redirectToHTTPS;
app.use(toHTTPS());
https.createServer(credentials, app).listen(443);
http.listen(80);



