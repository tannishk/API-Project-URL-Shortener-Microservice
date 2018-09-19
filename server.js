'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dns = require('dns');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var urls = [];

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new",function(req,res){
    let url = req.body.url;
    dns.lookup(url.substring(8), function (err, addresses, family) {
      if(err) res.json({"error":"invalid URL"});
      if(urls.indexOf(url)===-1){
      urls.push(url);
      }
      res.json({"original_url":url,"short_url":urls.indexOf(url)})
      });
});

 app.get("/api/shorturl/:indexId",(req,res)=>{
    let index = req.params.indexId;
    res.redirect(urls[index]);
 })

app.listen(port, function () {
  console.log('Node.js listening ...');
});