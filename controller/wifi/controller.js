const fs = require('fs');
const async = require('async');
const iwlist = require('wireless-tools/iwlist');
const exec = require("child_process").exec;


class WifiController {
  constructor() {

  }

  getListWifi() {
    return new Promise((resolve, reject) => {
      resolve([{
        name: 'a'
      }, {
        name: 'b'
      }]);
    });

  }

  connect(id, password) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  reboot_wlan0(callback){
    exec("sudo wpa_cli -i wlan0 reconfigure", (error,stdout,stderr)=>
    {
      if(!error){
        callback();
      }
      else{
        console.log("error while reset wlan0");
      }
    });
  }
  getSurroundWifi(){
    iwlist.scan("wlan0",(err,networks)=>{
      if(err){
          console.log('error while scan');
      }
      else{
          return networks();
      }
    });
  }
  connectWifiWithCredential(ssid,key,callback){
  }

}

module.exports = WifiController;