const express = require('express');
const profileController = require('../controllers/profileController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validateRequest = require('../middlewares/validateRequest');
const { uploadLogo, uploadProfileAssets } = require('../middlewares/upload');
const { updateJobSeekerProfileValidator, enterpriseUpdateRequestValidator } = require('../validators/profileValidator');

const router = express.Router();

router.use(authenticate);
router.get('/me', profileController.getMyProfile);
router.put(
  '/jobseeker',
  authorize('jobseeker'),
  uploadProfileAssets.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cvFile', maxCount: 1 },
  ]),
  updateJobSeekerProfileValidator,
  validateRequest,
  profileController.updateJobSeekerProfile,
);
router.put(
  '/enterprise/request-update',
  authorize('enterprise'),
  uploadLogo.fields([{ name: 'logo', maxCount: 1 }]),
  enterpriseUpdateRequestValidator,
  validateRequest,
  profileController.requestEnterpriseProfileUpdate,
);
router.get('/enterprise/request-status', authorize('enterprise'), profileController.getEnterpriseRequestStatus);

module.exports = router;
