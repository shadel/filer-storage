const Router = require('express')
  .Router;
const router = new Router();
const Controller = require('./controller');
const controller = new Controller();
router.route('/')
  .get((req, res) => {
    controller.getListWifi().then((data) => {
      res.status(200).json({
        result: data
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message
      });
    });
  });

router.route('/')
  .post((req, res) => {
    const body = req.body;
    const id = body.id;
    const password = body.password;
    controller.connect(id, password).then(() => {
      res.status(200).json({
        result: true
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message
      });
    });
  });
  router.route('/status')
    .get((req, res) => {
      controller.status().then((status) => {
        res.status(200).json({
          result: status
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message
        });
      });
    });

module.exports = router;