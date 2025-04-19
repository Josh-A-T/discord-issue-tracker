// Connection to the DB, pulls from .env
// rename included .env.example to just .env and update the variables accordingly. 
// Also insert a token for JWT auth 
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  }
);

module.exports = sequelize;