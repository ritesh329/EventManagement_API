

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const eventController = require('../controllers/events');


router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('dateTime').isISO8601().withMessage('Date must be in ISO8601 format'),
    body('location').notEmpty().withMessage('Location is required'),
    body('capacity')
      .isInt({ min: 1, max: 1000 })
      .withMessage('Capacity must be between 1 and 1000'),
  ],
  eventController.createEvent
);


router.get(
  '/:eventId',
  [param('eventId').isInt().withMessage('Event ID must be an integer')],
  eventController.getEventDetails
);


router.post(
  '/:eventId/register',
  [
    param('eventId').isInt().withMessage('Event ID must be an integer'),
    body('userId').isInt().withMessage('User ID must be an integer'),
  ],
  eventController.registerUser
);


router.delete(
  '/:eventId/registrations/:userId',
  [
    param('eventId').isInt().withMessage('Event ID must be an integer'),
    param('userId').isInt().withMessage('User ID must be an integer'),
  ],
  eventController.cancelRegistration
);


router.get('/upcoming', eventController.listUpcomingEvents);


router.get(
  '/:eventId/stats',
  [param('eventId').isInt().withMessage('Event ID must be an integer')],
  eventController.getEventStats
);

module.exports = router;
