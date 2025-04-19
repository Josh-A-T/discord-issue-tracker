/* 
 Controller functions for issues endpoint
 currently no auth protection at endpoints
*/
const { Issue } = require('../models');
const { Op } = require('sequelize');

const createIssue = async (req, res) => {
    try {
      const { username, comment, comment_media, reply_to } = req.body;
      const id = Date.now();
      const now = new Date();
      const date = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
      let issue_id = id;
      let status = 'Open';

      if (reply_to) {
        const parent = await Issue.findByPk(reply_to);
        if (!parent) return res.status(404).send({ error: 'Parent not found' });
        
        issue_id = parent.issue_id;
        status = 'NA';
      }
  
      const issue = await Issue.create({
        id,
        issue_id,
        username,
        date,
        comment,
        comment_media,
        reply_to,
        status
      });
  
      res.status(201).send(issue);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

const getIssueOrComment = async (req, res) => {
    try {
      const { id } = req.params;
      
      const item = await Issue.findOne({
        where: { id }
      });
  
      if (!item) {
        return res.status(404).send({ error: 'Not found' });
      }
  
      // Load any comments
      if (!item.reply_to) {
        const replies = await Issue.findAll({
          where: { issue_id: item.issue_id, reply_to: { [Op.not]: null } },
          order: [['id', 'ASC']]
        });
        return res.send({ main: item, replies });
      }
      res.send(item);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };
  
  const getIssueThread = async (req, res) => {
    try {
      const issue_id = req.params.issue_id;
      
      const [mainIssue, comments] = await Promise.all([
        Issue.findByPk(issue_id),
        Issue.findAll({
          where: { 
            issue_id,
            id: { [Op.ne]: issue_id } //Minus one, we dont need the issue loaded twice
          },
          order: [['id', 'ASC']]
        })
      ]);
  
      if (!mainIssue) {
        return res.status(404).send({ error: 'Issue not found' });
      }
  
      res.send({
        main: mainIssue,
        comments
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

  const getIssues = async (req, res) => {
    try {
      const issues = await Issue.findAll({
        where: {
          reply_to: null
        },
        order: [['issue_id', 'DESC']]
      });
  
      res.send(issues);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

module.exports = {
    createIssue,
    getIssueOrComment,
    getIssueThread,
    getIssues
  };