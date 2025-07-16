

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events', 
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'registrations',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'eventId'], 
    },
  ],
});

module.exports = Registration;
