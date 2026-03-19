const express = require('express');
const jobController = require('../controllers/jobController');
const authenticate = require('../middlewares/authenticate');
const optionalAuth = require('../middlewares/optionalAuth');
const authorize = require('../middlewares/authorize');
const validateRequest = require('../middlewares/validateRequest');
const { jobPayloadValidator } = require('../validators/jobValidator');

const router = express.Router();

router.get('/', optionalAuth, jobController.listJobs);
router.get('/search', optionalAuth, jobController.listJobs);
router.get('/filter', optionalAuth, jobController.listJobs);
router.get('/:id', optionalAuth, jobController.getJobById);
router.post('/', authenticate, authorize('enterprise'), jobPayloadValidator, validateRequest, jobController.createJob);
router.put('/:id', authenticate, authorize('enterprise'), jobPayloadValidator, validateRequest, jobController.updateJob);
router.delete('/:id', authenticate, authorize('enterprise'), jobController.deleteJob);
router.patch('/:id/close', authenticate, authorize('enterprise'), jobController.closeJob);

module.exports = router;
