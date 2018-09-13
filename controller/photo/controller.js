//const usbDetect = require('usb-detection');
const copydir = require('copy-dir');
const rimraf = require('rimraf');
const fs = require('fs');
const fse = require('fs-extra');
//const drivelist = require('drivelist');
const dir = process.env.DIR || __dirname + '/../../Pictures/';
const TIMEOUT_TO_RECEIVE_DEVICE = 5000;
const isImage = require('is-image');

class PhotoController {
  constructor() {
    this.pathConfig = __dirname + '/../../config-photo.json';
    fs.readFile(this.pathConfig, 'utf8', (err, data) => {
      if (!err) {
        this.datetime = JSON.parse(data).datetime;
      }
    })
    this.detectSD();
  }

  setDatetime(datetime) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.pathConfig, JSON.stringify({
        datetime
      }), {
        overwrite: true
      }, (error) => {
        if (!error) {
          resolve();
          this.datetime = datetime;
        } else {
          reject(error)
        }
      })
    })
  }

  loadDevices() {
    const datetime = this.datetime;
    //return new Promise((resolve, reject) => {
    //console.log('Loading devices ...');
    //const destPath = __dirname + '/../../' + dir;
    // drivelist.list((error, drives) => {
    //   if (error) {
    //     reject(error);
    //   } else {
    //     const listPromiseDrives = [];
    //     drives.forEach(element => {
    //       const promiseDrive = new Promise((resolveDrive, rejectDrive) => {
    //         if (element.isUSB) {
    //           rimraf(destPath, (_error) => {
    //             if (!_error) {
    //               const listPromisePoints = [];
    //               element.mountpoints.forEach((point) => {
    //                 const promise = new Promise((_resolve, _reject) => {
    //                   var path = point.path;
    //                   this.copyFiles(datetime, path, destPath)
    //                     .then(_resolve)
    //                     .catch(_reject);
    //                 });
    //                 listPromisePoints.push(promise);
    //               })
    //               Promise.all(listPromisePoints)
    //                 .then(resolveDrive)
    //                 .catch(rejectDrive);
    //             } else {
    //               rejectDrive(_error)
    //             }
    //           })
    //         } else {
    //           resolveDrive();
    //         }
    //       })
    //       listPromiseDrives.push(promiseDrive);
    //     });
    //     Promise.all(listPromiseDrives)
    //       .then(resolve)
    //       .catch(reject);
    //   }
    // });
    //})
  }

  copyFiles(datetime, path, dest) {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (error, items) => {
        if (!error) {
          const listPromises = [];
          items.forEach((item) => {
            const promise = new Promise((_resolve, _reject) => {
              const filePath = `${path}/${item}`;
              const destPath = `${dest}/${item}`;
              fs.stat(filePath, (err, stats) => {
                if (err) {
                  _reject(err)
                } else if (!stats.isDirectory()) {
                  if (datetime) {
                    const timestampDatetime = Math.floor((new Date(datetime)) / 1000);
                    const lastModified = Math.floor((new Date(stats.mtime.toString())) / 1000);
                    if (lastModified > timestampDatetime) {
                      fse.copy(filePath, destPath)
                        .then(_resolve)
                        .catch(_reject);
                    } else {
                      _resolve();
                    }
                  } else {
                    fse.copy(filePath, destPath)
                      .then(_resolve)
                      .catch(_reject);
                  }
                } else {
                  _resolve();
                }
              })
            });
            listPromises.push(promise);
          })
          Promise.all(listPromises)
            .then(resolve)
            .catch(reject)
        } else {
          reject(error);
        }
      })
    });
  }

  detectSD() {
    // this.loadDevices().then(() => {
    //     console.log('copied files successfully!')
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   })
    // usbDetect.startMonitoring();
    // usbDetect.on('add', () => {
    //   setTimeout(() => {
    //     this.loadDevices().then(() => {
    //         console.log('copied files successfully!')
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       })
    //   }, TIMEOUT_TO_RECEIVE_DEVICE);
    // });
  }

  getFilePath(id) {
    let name = id;
    return new Promise((resolve, reject) => {
      const imagePath = dir + name;
      resolve(imagePath);
    })
  }

  forceEmpty() {
    const destPath = dir;
    return new Promise((resolve, reject) => {
      fs.readdir(destPath, (error, items) => {
        console.log(items);
        Promise.all(items.filter((filePath) => {
            console.log(filePath, (/\.(gif|jpg|jpeg|tiff|png)$/i).test(filePath));
            return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(filePath);
          }).map((filePath) => this.deleteFile(`${destPath}/${filePath}`)))
          .then(resolve)
          .catch(reject)
      });
    })
  }

  deleteFile(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (_error) => {
        if (!_error) {
          resolve(path);
        } else {
          reject(_error);
        }

      })
    })
  }

  getFolderContent() {
    return new Promise((relv, rejc) => {
      const path = dir;
      fs.readdir(path, (error, items) => {
        if (!error) {
          const listImages = [];
          items.forEach((item) => {
            const filePath = `${path}${item}`;
            if(isImage(filePath)) {
              listImages.push(item);
            }
          });
          relv({
            images: listImages
          })
        } else {
          rejc(error)
        }
      });
    })
  }
}
module.exports = PhotoController;