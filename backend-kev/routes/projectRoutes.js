const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Submit new project
router.post('/', projectController.submitProject);

// Get all projects
router.get('/', projectController.getProjects);

module.exports = router;