const express = require('express');
const UsersController = require('../controllers/userControllers');
const router = express.Router();
const { logger } = require('../utils/logger');
const { errorHandlerMiddleware } = require('../middlewares/errorHandlers');

// User management routes
router.get('/',
  (req, res, next) => {
    logger.info('Fetching all users');
    UsersController.getAllUsers(req, res, next);
  }
);

module.exports = router;
