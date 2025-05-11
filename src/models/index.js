/*
  index.js 
  Automatically loads any model into the index and ignores .test.js files for future use


  ===CAUTION===
  DOES NOT USE SSL YET

  
*/

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const { DataTypes } = Sequelize;
const db = {};

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file !== basename &&
      file.endsWith('.js') &&
      !file.includes('.test.js')  
    )
  })

  .forEach(file => {
    try {
      const model = require(path.join(__dirname, file))(sequelize, DataTypes);
      db[model.name] = model;
    } catch (error) {
      console.error(`Error loading model ${file}:`, error);
    }
  });

Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
