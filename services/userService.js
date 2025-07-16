const sequelize = require('../config/sequelize');

class UserService {
  // 👤 Create user
  async createUser(name, email) {
    // 🔍 Check if email already exists
    const [existingUsers] = await sequelize.query(
      `SELECT * FROM users WHERE email = :email LIMIT 1`,
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingUsers) {
      throw new Error('Email already in use');
    }

    // ✅ Insert new user and return ID
    const [result] = await sequelize.query(
      `INSERT INTO users (name, email)
       VALUES (:name, :email)
       RETURNING id`,
      {
        replacements: { name, email },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    return result[0].id;
  }

  // 🔍 Get user by ID
  async getUser(userId) {
    const [users] = await sequelize.query(
      `SELECT * FROM users WHERE id = :userId`,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const user = users;

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = new UserService();
