const express = require('express');
const savedJobController = require('../controllers/savedJobController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.use(authenticate, authorize('jobseeker'));
router.post('/:jobId', savedJobController.saveJob);
router.get('/', savedJobController.listSavedJobs);
router.delete('/:jobId', savedJobController.removeSavedJob);

module.exports = router;
