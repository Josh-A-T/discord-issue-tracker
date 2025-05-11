/*
  Data model for users.

    id: type INT, primary key value, auto increments
    discordId: this may change, in the future will get profileid or something from the discord bot to tie it to a user 
    username: captured username from the bot
    discriminator: legacy discord pre 2023 name change update.
    email: email for user, maybe we can et it from discord
    password: user password, hashed elsewhere
    isAdmin: flags if a user is admin. admins can change status of threads and lock them. maybe more later
    avatar: from discord

*/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    discordId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false
    },

    discriminator: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notEmpty: true,
      }
    },

    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    avatar: {
      type: DataTypes.STRING
    }
  }, {
    indexes: [
      { fields: ['discordId']},
      { fields: ['email']}
    ],
    hooks: {
      beforeCreate: async (user) => {
        user.username = user.username.toLowerCase();
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if( user.changed('username')){
          user.username = user.username.toLowerCase();
        }
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

  User.associate = (models) => {
    User.hasMany(models.Bug, { foreignKey: 'userId' });
    User.hasMany(models.Comment, { foreignKey: 'userId' });
  };
  return User;
};