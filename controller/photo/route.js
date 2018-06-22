const Router = require('express')
  .Router;
const router = new Router();
const Controller = require('./controller');
const controller = new Controller();

router.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    controller.getImageInfo(id)
      .then((data) => {
        res.status(200).json({
          result: data
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message
        });
      })
  });

  router.route('/download/:id')
  .get((req, res) => {
    const id = req.params.id;
    controller.getFilePath(id)
      .then((imagePath) => {
        res.download(imagePath);
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message
        });
      })
  });
router.route('/force_empty')
  .get((req, res) => {
    controller.forceEmpty()
      .then(() => {
        res.status(200).json({
          result: true
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message
        });
      })
  });

router.route('/')
  .post((req, res) => {
    const datetime = req.body.datetime;
    controller.setDatetime(datetime)
      .then(() => {
        controller.loadDevices()
          .then(() => {
            console.log('copied files successfully!');
            res.status(200).json({
              result: true
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: err.message
            });
          });
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message
        });
      })
  });
module.exports = router;