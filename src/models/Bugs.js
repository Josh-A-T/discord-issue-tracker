/*
  Data model for Bugs

    id: type INT, primary key value, auto increments
    userId: user Id of the comment creator.
    title: Bug report Title
    body: Bug report text body can be up to 10000 characters max for now
    mediaUrls: any attached media
    status: status of bug report, can be Open, Closed, In-Progress or Resolved. Incluedes logic to constrain statuc changes. 
            Open can only change to In-Progress or Closed 
            In-Progress can change to Closed or Resolved
            Status is Open by default
    priority: Priority of Bug Report. Can be Low Medium or High. Priority is Low by default

    paranoid is enabled for soft deletion if needed.

*/

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize, DataTypes) => {

    const Bug = sequelize.define('Bug', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [10, 100]
            }
        },

        body: {
            type: DataTypes.TEXT,
            allowNull: false, 
            validate: {
                notEmpty:true,
                len: [100,10000]
            }
        },

        mediaUrls: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        },

        status: {
            type: DataTypes.ENUM('Open', 'In-Progress', 'Closed', 'Resolved'),
            defaultValue: 'Open',
            validate: {
                isValidTransition(newStatus) {
                    const allowed = {
                    'Open': ['In-Progress', 'Closed'],
                    'In-Progress': ['Closed', 'Resolved']
                    };
                    if (this.previous('status') && !allowed[this.previous('status')]?.includes(newStatus)) {
                    throw new Error('Invalid status transition');
                    }
                }
            }
        },
        
        priority: {
            type: DataTypes.ENUM('Low', 'Medium', 'High'),
            defaultValue: 'Low',
        }
    }, {
        timestamps: true,
        paranoid: true,
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