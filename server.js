const fs = require('fs');
const credentials = {
  key: fs.readFileSync('sslcert/wilsonle.me.key', 'utf8'),
  cert: fs.readFileSync('sslcert/wilsonle.me.chained.crt', 'utf8')
}
const express = require("express");
const app = express();
const http = require("http").createServer(app);
//https
const https = require("https").createServer(credentials, app);
const toHTTPS = require('./toHTTPS.js').redirectToHTTPS;
app.use(toHTTPS())

//dtb
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
// Set some defaults for dtb - create new dbfile if not yet created
db.defaults({ posts: [] })
  .write()

//create route to respond -send db.json to client
app.get("/posts", (req, res) => {
  res.send(db.get("posts"));
});

// allow client to browse whole folder
app.use(express.static('.'))

// routing
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});



http.listen(80);
https.listen(443);