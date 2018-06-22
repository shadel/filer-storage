const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv')
  .config();
const config = require('./config');
const app = express();
const server = require('http').createServer(app);
const redis = require("redis");
const SonyCamera = require("./sony_camera_lib");

var fs = require('fs');

const PhotoController = require('./controller/photo/controller');
const photoController = new PhotoController();

var sub = redis.createClient();
var pub = redis.createClient();
var cam = new SonyCamera();
// cam.connect(function (e) {
//      cam.setPostviewImageSize(function (){
//
//          console.log('set post view success');
//      })
// })

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

const siteURL = process.env.SITE_URL || 'http://localhost:8000';
const whitelist = [siteURL];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: true
    }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = {
      origin: false
    }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate), (req, res, next) => {
  next();
});

//subscribe redis for msg from DJI
sub.on("message", function (channel, msg) {
    if(channel=="c_connect"){
        console.log("connecting the camera");
        cam.connect(function () {
            cam.connect(function (e) {
                cam.setPostviewImageSize(function (){
                    console.log('set post view success');
                    pub.publish("cam_connected","S");
                    //todo if failed call pub.publish("cam_connected","F");
                })
            })



        });
    }
    else if(channel=="c_disconnect"){
        console.log("disconnect");
        cam.disconnect();
    }
    else if(channel=="c_zoomin"){
        console.log("zoom in");
        cam.zoomIn();
    }
    else if(channel=="c_zoomout"){
        console.log("zoom out");
        cam.zoomOut();
    }
    else if(channel=="c_capture"){
        cam.halfPressShutter(function(){
            setTimeout(function(){
                cam.capture(true, function(err, name, image) {
                    name = name.split('.').map((name, idx) => idx ? idx : msg);
                    if(err) {
                        console.log("error when take photo: "+ err);
                        pub.publish("capture_status","F|" + name); //very important to send back into to android
                    }
                    if(image)
                    {
                        try {
                            // save rawData to Picture photos and output the fileName
                            fs.writeFile(`./Pictures/${name}`, Buffer.concat(rawData), function(err) {
                                if(err) {
                                    return console.log(err);
                                }
                                
                                console.log(`File: ${name} was saved!`);
                                console.log('store successfully for id:'+msg + ' with name: '+ name);
				pub.publish("capture_status","S|" + msg);//very important to send back into to android		
                            });
                        } catch (ex) {
                            console.log(ex);
                        }
                    }
                    if(name && !image)
                    {
                        console.log("successfully capture the image but not yet save: "+ name);

                    }
                });
            },1500);
        });
    }

    else{
    }

});
sub.subscribe("c_connect");
sub.subscribe("c_disconnect");
sub.subscribe("c_capture");
sub.subscribe("c_zoomin");
sub.subscribe("c_zoomout");

server.listen(config.server.port, () => {
  console.log('Start Rasp Image Proxy Server at port ' + config.server.port);
  const routes = require('./routes');
  app.use('/', routes);
});

module.exports = app;
