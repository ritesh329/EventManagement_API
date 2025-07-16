const eventService = require('../services/eventService');
const { validationResult } = require('express-validator');

exports.createEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { title, dateTime, location, capacity } = req.body;
    const eventId = await eventService.createEvent(title, dateTime, location, capacity);
    res.status(201).json({ eventId });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

exports.getEventDetails = async (req, res) => {
  try {
    // console.log(req.params.eventId);
    const eventId = parseInt(req.params.eventId, 10);

    const event = await eventService.getEventDetails(eventId);
    res.json(event);
  } catch (err) {
    console.log("error found");
    res.status(404).json( {error: err.message ||'Event not found'} );
  }
};

exports.registerUser = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const userId = parseInt(req.body.userId, 10);

    await eventService.registerUser(eventId, userId);
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const userId = parseInt(req.params.userId, 10);

    await eventService.cancelRegistration(eventId, userId);
    res.json({ message: 'Registration cancelled successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Cancellation failed' });
  }
};

exports.listUpcomingEvents = async (req, res) => {
  try {
    const events = await eventService.listUpcomingEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch events' });
  }
};

exports.getEventStats = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const stats = await eventService.getEventStats(eventId);
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to fetch event stats' });
  }
};
