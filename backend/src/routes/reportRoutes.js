const express = require('express');
const reportController = require('../controllers/reportController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validateRequest = require('../middlewares/validateRequest');
const { createReportValidator } = require('../validators/reportValidator');

const router = express.Router();

router.post('/', authenticate, authorize('jobseeker'), createReportValidator, validateRequest, reportController.createReport);

module.exports = router;
