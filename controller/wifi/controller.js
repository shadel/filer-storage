const fs = require('fs');
const async = require('async');
const iwlist = require('wireless-tools/iwlist');
const exec = require("child_process").exec;


class WifiController {
  constructor() {

  }

  getListWifi() {
    return new Promise((resolve, reject) => {
      this.getSurroundWifi()
        .then((networks) => {
          const listSSID = networks.map(x => x.ssid);
          resolve(listSSID);
        })
        .then(reject);
    });

  }

  connect(id, password) {
    return new Promise((resolve, reject) => {
      this.connectWifiWithCredential(id, password)
        .then(resolve)
        .catch(reject);
    });
  }

  reboot_wlan0(callback) {
    exec("sudo wpa_cli -i wlan0 reconfigure", (error, stdout, stderr) => {
      if (!error) {
        callback();
      } else {
        console.log("error while reset wlan0");
      }
    });
  }
  getSurroundWifi() {
    return new Promise((resolve, reject) => {
      iwlist.scan("wlan0", (err, networks) => {
        if (err) {
          console.log('error while scan', err);
          resolve([]);
        } else {
          console.log(networks);
          resolve(networks);
        }
      });
    })
  }
  connectWifiWithCredential(ssid, key) {
    return new Promise((resolve, reject) => {
      fs.readFile('sample_wpa_supplicant.conf', 'utf8', function (err, data) {
        if (err) {
          console.log(err);
          reject(err)
        }
        var result = data.replace('WPAPWD', key)
          .replace('WPASSID', ssid);
  
        fs.writeFile('/etc/wpa_supplicant/wpa_supplicant.conf', result, 'utf8', function (err) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    })
  }

}

module.exports = WifiController;