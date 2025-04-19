const sequelize = require('../config/db');
const User = require('./User');
const Issue = require('./Issue');

// Define relationships
User.hasMany(Issue, { foreignKey: 'userId' });
Issue.belongsTo(User, { foreignKey: 'userId' });

// Sync all models
sequelize.sync()
  .then(() => console.log('Database & tables synced '))
  .catch(err => console.error('Error syncing database:', err));

module.exports = {
  User,
  Issue
};