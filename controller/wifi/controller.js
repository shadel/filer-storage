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
}

module.exports = WifiController;