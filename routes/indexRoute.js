const express = require('express');
const router = express.Router();

const indexGetController = require('../controllers/index/get');

const indexPostController = require('../controllers/index/post');

router.get(
  '/', 
  indexGetController
);

router.post(
  '/',
  indexPostController
);

module.exports = router;
