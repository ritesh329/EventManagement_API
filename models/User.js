// models/user.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Adjust if path is different

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  }
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;
