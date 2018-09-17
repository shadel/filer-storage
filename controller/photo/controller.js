//const usbDetect = require('usb-detection');
const fs = require('fs');
//const drivelist = require('drivelist');
const _path = require('path');
const rootPath = _path.join(__dirname, '/../..');
const dir = process.env.DIR || _path.join(rootPath, '/Pictures/');
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
      this.getFilePath(id).then((imagePath)=>{
        const dest = imagePath.replace(/(\.[\w\d_-]+)$/i, '_thumb$1');
        fs.exists(dest, (exists) => {
          if(exists) {
            resolve(dest);  
          }else {
            sharp(imagePath)
            .resize(250)
            .toFile(dest, (err, info) => {
              resolve(dest);
            });
          }
        })
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
            if(isImage(filePath) && filePath.indexOf('_thumb.') === -1 ) {
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