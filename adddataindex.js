
const redis = require("redis");

pub = redis.createClient();
//pub.publish("cam_status","F");
//pub.publish("cam_status","S");

//pub.publish("cam_connected","F");
//pub.publish("cam_connected","S");

//pub.publish("capture_status","F|15");
pub.publish("capture_status","S|14");
