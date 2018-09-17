const express = require('express');
const Router = express.Router;
const router = new Router();

const photo = require('./controller/photo/route');

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome rasp image API!' });
});

router.use('/api/photo', photo);
module.exports = router;
