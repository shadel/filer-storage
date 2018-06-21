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


var sub = redis.createClient();
var cam = new SonyCamera();


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
        cam.connect();
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
        console.log("capture for id:" + msg);
        cam.halfPressShutter(function(){
            console.log("half press finished"); 
            setTimeout(function(){
                cam.capture(true, function(err, name, image) {
                    if(err) {
                        console.log("error when take photo: "+ err);
                    }
                    if(image)
                    {
                        console.log("get the image");
                      //io.emit('image', image.toString('base64'));
                    }
                    if(name && !image)
                    {
                        console.log("get the image with name: "+ name);
                        //todo save the entity(id,name) with id = msg;
                      //io.emit('status', "new photo: " + name);
                    }
                });
            },1500);
        });
    }
    else if(channel=="c_onusb"){
        console.log("on usb");
       //todo Khanh call function for turn on usb of camera
    }
    else if(channel=="c_on==offusb"){
        console.log("off usb");
        //todo Khanh call function for turn off usb of camera
    }
    else{
    }

});
sub.subscribe("c_connect");
sub.subscribe("c_disconnect");
sub.subscribe("c_capture");
sub.subscribe("c_zoomin");
sub.subscribe("c_zoomout");
sub.subscribe("c_onusb");
sub.subscribe("offusb");

server.listen(config.server.port, () => {
  console.log('Start Rasp Image Proxy Server at port ' + config.server.port);
  const routes = require('./routes');
  app.use('/', routes);
  // const photoController = new PhotoController();
  // photoController.detectSD();
});

module.exports = app;
