const express = require('express');
const router = express.Router();
const liabilityController = require('../controllers/liabilityController');

router.post('/', liabilityController.createLiability);

module.exports = router; 