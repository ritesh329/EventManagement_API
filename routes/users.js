

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const userController = require('../controllers/users');


router.post(
  '/',
  [
    body('name')
      .notEmpty()
      .withMessage('Name is required'),

    body('email')
      .isEmail()
      .withMessage('Invalid email format'),
  ],
  userController.createUser
);

router.get(
  '/:userId',
  [
    param('userId')
      .isInt()
      .withMessage('User ID must be an integer'),
  ],
  userController.getUser
);

module.exports = router;
