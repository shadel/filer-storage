const fs = require('fs');
const async = require('async');
const iwlist = require('wireless-tools/iwlist');
const exec = require("child_process").exec;


class WifiController {
  constructor() {

  }

  getListWifi() {
    //todo need to wait it done
    var wifiAPs= this.getSurroundWifi();
    console.log(wifiAPs);
    //[  
      //  { address: 'c8:94:bb:a7:f2:34',
      //    channel: 2,
      //    frequency: 2.417,
      //    mode: 'master',
      //    quality: 23,
      //    signal: -87,
      //    ssid: 'DODO-F22B',
      //    security: 'wpa2' 
      //  }
      //]  
    
    //todo from object above, get ssid and return
    return new Promise((resolve, reject) => {
      resolve([{
        name: 'a'
      }, {
        name: 'b'
      }]);
    });

  }

  connect(id, password) {
   //todo call function connectWifiWithCredential
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
	return [];
      }
      else{
          console.log(networks);
          //todo trieu, need to wait for result  
        
          return networks;
      }
    });
  }
  connectWifiWithCredential(ssid,key,callback){
	fs.readFile('sample_wpa_supplicant.conf', 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  var result = data.replace('WPAPWD', key)
					.replace('WPASSID', ssid);
	
	  fs.writeFile('/etc/wpa_supplicant/wpa_supplicant.conf', result, 'utf8', function (err) {
	     if (err) {
	        return console.log(err);
	     }
	     else{ 
	      callback();
	     }
		
	  });
});
  }

}

module.exports = WifiController;