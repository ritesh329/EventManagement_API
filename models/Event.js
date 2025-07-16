// models/event.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // 👈 Adjust path if needed

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 1000,
    },
  }
}, {
  tableName: 'events',
  timestamps: false,
});

module.exports = Event;
