const express = require('express');
const router = express.Router();
const { createIssue, getIssueOrComment, getIssueThread, getIssues } = require('../controllers/issues.controller');

// Create new issue
router.post('/', createIssue);          // POST /api/issues
router.get('/', getIssues);             // GET /api/issues (list all)
router.get('/:id', getIssueOrComment);  // GET /api/issues/:id (single issue)
router.get('/thread/:issue_id', getIssueThread); // GET /api/issues/thread/:issue_id

module.exports = router;