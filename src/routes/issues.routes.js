const express = require('express');
const router = express.Router();
const { createIssue, getIssueOrComment, getIssueThread, getIssues } = require('../controllers/issues.controller');

// Create new issue
router.post('/', createIssue);
router.get('/', getIssues);

// Get issue or comment by primary ID
router.get('/:id', getIssueOrComment);

// Get full thread by issue_id
router.get('/thread/:issue_id', getIssueThread);

module.exports = router;