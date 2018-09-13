const express = require('express');
const path = require('path');
const Router = express.Router;
const router = new Router();

const wifi = require('./controller/wifi/route');
const photo = require('./controller/photo/route');

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome rasp image API!' });
});

router.use('/api/wifi', wifi);
router.use('/api/photo', photo);
module.exports = router;
