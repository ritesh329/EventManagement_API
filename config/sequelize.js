
const { Sequelize } = require('sequelize');


require('dotenv').config();


const sequelize = new Sequelize(
  process.env.DB_NAME,      
  process.env.DB_USER,      
  process.env.DB_PASSWORD,  
  {
    host: process.env.DB_HOST,     
    port: process.env.DB_PORT,     
    dialect: 'postgres',           
    logging: false,               

   
  }
);


sequelize.authenticate()
  .then(() => {
    console.log(' Database connected successfully.');
  })
  .catch((error) => {
    console.error(' Unable to connect to the database:', error.message);
  });


module.exports = sequelize;
