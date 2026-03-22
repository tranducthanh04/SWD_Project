const express = require('express');
const jobController = require('../controllers/jobController');
const applicationController = require('../controllers/applicationController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validateRequest = require('../middlewares/validateRequest');
const { updateApplicationStatusValidator } = require('../validators/applicationValidator');

const router = express.Router();

router.use(authenticate, authorize('enterprise'));

router.get('/jobs/my', jobController.listMyJobs);
router.get('/applications', applicationController.getEnterpriseApplications);
router.get('/jobs/:jobId/applications', applicationController.getApplicantsByJob);
router.patch('/applications/:id/status', updateApplicationStatusValidator, validateRequest, applicationController.updateApplicationStatus);

module.exports = router;
