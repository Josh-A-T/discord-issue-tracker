/*
Data model for Issues and comments.

    "id": "unix timecode, primary ID",
    "username": "captured username",
    "date": "dd-mm-yyyy hh:mm",
    "comment": "Captured comment from discord bot",
    "comment_media" : "Any image attached to the report"
    "issue_id": "should match primary id of whatever issue the comment is attached to",
    "reply_to": "relates to issue_id ",
    "is_pinned:": false
    "status": "Open" "In-Progress" "Closed" "Resolved"

New issues are given an unix timecode as an ID when first generated and mirrored to issue_id. Username, Comment and any attached media are captured from the discord bot and stored in 'username', 'comment', and 'comment_media'
along with the date/time the issue was reported. Issues can have any of 4 different statuses ("Open" "In-Progress" "Closed" "Resolved"), all start open by default.

Any follow up messages are considered comments and have a few different fields.
issue_id always match the parent issue_id, any comments in reply to a different comment will be given the id (primary) of the comment they are responding to in the 'reply_to" field. This will allow for non-sequential 
threaded messaging in the front end later (I hope)

*/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Issue = sequelize.define('issues', {

  id: {
    type: DataTypes.BIGINT, // Unix timestamp as primary key
    primaryKey: true
  },
  issue_id: {
    type: DataTypes.BIGINT, // Matches parent issue's id
    allowNull: false,
    defaultValue: function() {
      return this.id; // Default to own id for new issues
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  comment_media: {
    type: DataTypes.TEXT
  },
  reply_to: {
    type: DataTypes.BIGINT, 
    allowNull: true
  },
  is_pinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('Open', 'In-Progress', 'Closed', 'Resolved', 'NA'),
    defaultValue: 'Open'
  }
  
}, {
  freezeTableName:true,
  indexes: [
    {
      fields: ['issue_id']
    },
    {
      fields: ['reply_to'] 
    }
  ]
});

module.exports = Issue;