const Router = require('express')
  .Router;
const router = new Router();
const Controller = require('./controller');
const controller = new Controller();

router.route('/download/:id')
  .get((req, res) => {
    const id = req.params.id;
    controller.getFilePath(id)
      .then((imagePath) => {
        setTimeout(() => {
          res.download(imagePath);
        }, 300);
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message
        });
      })
  });
router.route('/thumbnail/:id')
  .get((req, res) => {
    const id = req.params.id;
    controller.getFilePathThumb(id)
      .then((imagePath) => {
        setTimeout(() => {
          res.download(imagePath);
        }, 300);
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message
        });
      })
  });
router.route('/explore/:page/:number')
  .get((req, res) => {
    const page = parseInt(req.params.page);
    const number = parseInt(req.params.number);
    controller.getFolderContent(page, number)
      .then((data) => {
        res.json(data);
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

module.exports = router;