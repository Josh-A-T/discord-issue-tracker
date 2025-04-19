require('dotenv').config();
const { Sequelize } = require('sequelize');
const { User, Issue } = require('./src/models');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log 
  }
);

async function resetDatabase() {
  try {
    console.log('Starting database reset...');
    
    await sequelize.authenticate();
    console.log('Connection to database established');
    
    await sequelize.query('DROP TABLE IF EXISTS "Issues" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "Users" CASCADE');
    console.log('Dropped all tables');
    
    
    await sequelize.sync({ force: false });
    console.log('Recreated empty tables');
    
    console.log('Database reset completed successfully!');
    console.log('\nDatabase is now in a fresh, empty state ready for use.');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();