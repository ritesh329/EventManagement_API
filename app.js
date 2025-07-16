

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/sequelize'); 
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);




sequelize.sync({ alter: true }) 
  .then(() => {
    console.log(' Database connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' Unable to connect to the database:', err.message);
    process.exit(1);
  });

module.exports = app;
