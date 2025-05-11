/*
  Data model for Comments

    id: type INT, primary key value, auto increments
    userId: user Id of the comment creator.
    editedAt: if a comment is edited update accordingly
    status: comment status, for admin use later on can be 'Public', 'Private', or 'Deleted'
    bugId: reference to the bug report the comment is on
    body: body text can be up to 10000 characters max for now
    replyTo: if a comment replies to a comment record the commentId here
    mediaUrls: any attached media

    paranoid is enabled for soft deletion if needed.

*/

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
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

        editedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        status: {
            type: DataTypes.ENUM('Public', 'Private', 'Delete'),
            defaultValue: 'Open',
        },

        bugId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'bugs',
                key: 'id'
            }
        },

        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 10000]
            }
        },

        replyTo: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Comments',
                key: 'id',
            }
        },

        mediaUrls: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        },
    },{
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['bugId']},
            { fields: ['userId']},
            { fields: ['replyTo']}
        ]
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.User, {foreignKey: 'userId'});
        Comment.belongsTo(models.Bug, {foreignKey: 'bugId'});
        Comment.belongsTo(models.Comment, {foreignKey: 'replyTo', as: 'ParentComment'});
        Comment.hasMany(models.Comment, {foreignKey: 'replyTo', as: 'Replies'});
    }

    return Comment;
}