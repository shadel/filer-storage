//const usbDetect = require('usb-detection');
const fs = require('fs');
//const drivelist = require('drivelist');
const _path = require('path');
const rootPath = _path.join(__dirname, '/../..');
const dir = process.env.DIR || _path.join(rootPath, '/Pictures/');
const cacheDir = process.env.CACHE || _path.join(rootPath, '/cache/');
const isImage = require('is-image');
const sharp = require('sharp');

class PhotoController {
  constructor() {
    this.pathConfig = __dirname + '/../../config-photo.json';
    fs.readFile(this.pathConfig, 'utf8', (err, data) => {
      if (!err) {
        this.datetime = JSON.parse(data).datetime;
      }
    })
    fs.exists(dir, (exists) => {
      if(!exists) {
        fs.mkdirSync(dir);
      }
    })
    fs.exists(cacheDir, (exists) => {
      if(!exists) {
        fs.mkdirSync(cacheDir);
      }
    })
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

  getFilePath(id) {
    let name = id;
    return new Promise((resolve, reject) => {
      const imagePath = dir + name;
      resolve(imagePath);
    })
  }

  getFilePathThumb(id) {
    return new Promise((resolve, reject) => {
      const imagePath = cacheDir + id;
      const src = dir + id;
      fs.exists(imagePath, (exists) => {
        if(exists) {
          resolve(imagePath);  
        }else {
          sharp(src)
          .resize(250)
          .toFile(imagePath, (err, info) => {
            if(err) {
              reject(err)
            }else{
              resolve(imagePath);
            }
          });
        }
      })
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

  getFolderContent(page, number) {
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
          page = page || 1;
          const offset = (page - 1) * number;
          const paginatedItems = [];
          for (let index = offset; index < offset + number; index++) {
            paginatedItems.push(listImages[index]);
          }
          relv({
            images: paginatedItems,
            pages: Math.round((listImages.length / number)),
            total: listImages.length
          })
        } else {
          rejc(error)
        }
      });
    })
  }
}
module.exports = PhotoController;