const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

// Import models
const UserModel = require('./user.model');
const EventModel = require('./event.model');

// Initialize models with sequelize instance
const User = UserModel(sequelize, DataTypes);
const Event = EventModel(sequelize, DataTypes);

// Define many-to-many relationship through 'registrations' table
User.belongsToMany(Event, {
  through: 'registrations',
  foreignKey: 'userId',
  otherKey: 'eventId',
});

Event.belongsToMany(User, {
  through: 'registrations',
  foreignKey: 'eventId',
  otherKey: 'userId',
});

// Export all
module.exports = {
  sequelize,
  Sequelize,
  User,
  Event,
};
