//const usbDetect = require('usb-detection');
const copydir = require('copy-dir');
const rimraf = require('rimraf');
const fs = require('fs');
const fse = require('fs-extra');
const db = require('../../db/db');
//const drivelist = require('drivelist');
const dir = 'Pictures';
const TIMEOUT_TO_RECEIVE_DEVICE = 5000;

class PhotoController {
  constructor(photoDB, indexDB) {
    this.pathConfig = __dirname + '/../../config-photo.json';
    fs.readFile(this.pathConfig, 'utf8', (err, data) => {
      if (!err) {
        this.datetime = JSON.parse(data).datetime;
      }
    })
    this.detectSD();
    this.photoDB = db.getInstance().photoDB;
    this.indexDB = db.getInstance().indexDB;
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

  getFilePath (id) {
    return new Promise((resolve, reject) => {
      this.getImageInfo(id)
        .then((data) => {
          console.log(data);
          const imagePath = __dirname + '/../../Pictures/' + data.name;
          resolve(imagePath);
        })
        .catch((err) => {
          reject(err);
        })
    })
  }

  updateImageInfo(id, name) {
    id = parseInt(id);
    return new Promise((resolve, reject) => {
      const dataStore = {
        _id: id,
        name
      };
      this.photoDB.update({
        _id: id
      }, dataStore, {upsert: true}, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      })
    })
  }

  insertImageInfo(name) {
    return new Promise((resolve, reject) => {
      this.getIndex()
        .then((data) => {
          const _id = data.value;
          const dataStore = {
            // _id,
            name
          };
          this.photoDB.insert(dataStore, (error) => {
            if (error) {
              reject(error);
            } else {
              this.updateIndex()
                .then(resolve)
                .catch(reject);
            }
          })
        })
        .catch(reject)
    })
  }

  insertImageList(images) {
    return new Promise((resolve, reject) => {
      this.getIndex()
        .then((data) => {
          const _id = data.value;
          // images.forEach((image) => {
          //   image._id = _id;
          //   _id++;
          // })
          this.photoDB.insert(images, (error) => {
            if (error) {
              reject(error);
            } else {
              this.updateIndex(_id)
                .then(resolve)
                .catch(reject);
            }
          })
        })
    })
  }
  getImageInfo(id) {
    return new Promise((resolve, reject) => {
      this.photoDB.findOne({
        _id: parseInt(id)
      }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      })
    })
  }

  getIndex() {
    return new Promise((resolve, reject) => {
      indexDB.findOne({
        _id: 'index_photo'
      }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          if (!data) {
            indexDB.insert({
              _id: 'index_photo',
              value: 10
            }, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve({
                  _id: 'index_photo',
                  value: 10
                })
              }
            })
          }else{
            resolve(data)
          }
        }
      })
    })
  }

  updateIndex(number) {
    return new Promise((resolve, reject) => {
      indexDB.update({
        _id: 'index_photo'
      }, {
        $inc: {
          value: number ? number : 1
        }
      }, (err) => {
        if(err) {
          reject(err)
        }else{
          resolve();
        }
      })
    })
  }
}

module.exports = PhotoController;