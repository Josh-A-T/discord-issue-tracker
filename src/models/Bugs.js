const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize, DataTypes) => {

    const Bug = sequelize.define('bug', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [10, 100]
            }
        },

        bugBody: {
            type: DataTypes.TEXT,
            allowNull: false, 
            validate: {
                notEmpty:true,
                len: [100,10000]
            }
        },

        bugMedia: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        },

        status: {
            type: DataTypes.ENUM('Open', 'In-Progress', 'Closed', 'Resolved', 'NA'),
            defaultValue: 'Open',
        },
        
        priority: {
            type: DataTypes.ENUM('Low', 'Medium', 'High'),
            defaultValue: 'Low',
        }
    }, {
        timestamps: true,
        indexes: [
            { fields: ['status']},
            { fields: ['userId']}
        ]
    });

Bug.associate = (models) => {
    Bug.belongsTo(models.User, {foreignKey: 'userId' });
    Bug.hasMany(models.Comment, {foreignKey: 'bugId' });
};

return Bug;
};