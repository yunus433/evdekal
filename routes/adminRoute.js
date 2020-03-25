const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

const authGetController = require('../controllers/admin/auth/get');
const indexGetController = require('../controllers/admin/index/get');

const authPostController = require('../controllers/admin/auth/post');
const indexPostController = require('../controllers/admin/index/post');

router.get(
  '/login',
  authGetController
);
router.get(
  '/',
  isAdmin,
  indexGetController
);

router.post(
  '/login',
  authPostController
);
router.post(
  '/',
  indexPostController
);

module.exports = router;
