const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

router.post('/send-project', smsController.sendProjectSMS);

module.exports = router;