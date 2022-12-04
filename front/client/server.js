const express = require('express')
const path = require('path')
const https = require('https')
const fs = require('fs');
const app = express()

https.createServer({
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.cert')
}, app).listen(3000 , () => {

  app.use(express.static(path.join(__dirname, 'public')))
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'))
  })
  app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/login.html'))
  })
  app.get('/home', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/home.html'))
  })
  app.get("/  ", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "service-worker.js"));
  });
})

