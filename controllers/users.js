const userService = require('../services/userService');
const { validationResult } = require('express-validator');

exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email } = req.body;
    const userId = await userService.createUser(name, email);
    res.status(201).json({ userId });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create user' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const user = await userService.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get user' });
  }
};
