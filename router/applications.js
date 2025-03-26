const express = require('express');
const router = express.Router();
const { applicationController } = require('../controllers');

// middleware that is specific to this router

router.get('/', applicationController.getLatestsApplications);

module.exports = router