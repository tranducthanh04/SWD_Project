const express = require('express');
const applicationController = require('../controllers/applicationController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validateRequest = require('../middlewares/validateRequest');
const { uploadCv } = require('../middlewares/upload');
const { createApplicationValidator } = require('../validators/applicationValidator');

const router = express.Router();

router.use(authenticate, authorize('jobseeker'));

router.post('/:jobId', uploadCv.single('cvFile'), createApplicationValidator, validateRequest, applicationController.applyForJob);
router.get('/my', applicationController.listMyApplications);
router.get('/my/:id', applicationController.getMyApplicationDetail);
router.patch('/:id/withdraw', applicationController.withdrawApplication);

module.exports = router;
