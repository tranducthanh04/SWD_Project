const express = require('express');
const adminController = require('../controllers/adminController');
const jobController = require('../controllers/jobController');
const reportController = require('../controllers/reportController');
const tagController = require('../controllers/tagController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validateRequest = require('../middlewares/validateRequest');
const { adminReviewValidator } = require('../validators/jobValidator');
const { tagValidator } = require('../validators/tagValidator');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/ban', adminController.banUser);
router.patch('/users/:id/unban', adminController.unbanUser);
router.delete('/users/:id', adminController.deleteUser);

router.get('/jobs/pending', jobController.listPendingJobs);
router.patch('/jobs/:id/approve', adminReviewValidator, validateRequest, jobController.approveJob);
router.patch('/jobs/:id/reject', adminReviewValidator, validateRequest, jobController.rejectJob);

router.get('/enterprise-update-requests', adminController.listEnterpriseUpdateRequests);
router.patch('/enterprise-update-requests/:id/approve', adminReviewValidator, validateRequest, adminController.approveEnterpriseUpdateRequest);
router.patch('/enterprise-update-requests/:id/reject', adminReviewValidator, validateRequest, adminController.rejectEnterpriseUpdateRequest);

router.get('/reports', reportController.listReports);
router.get('/reports/:id', reportController.getReportById);

router.get('/tags', tagController.listAllTags);
router.post('/tags', tagValidator, validateRequest, tagController.createTag);
router.put('/tags/:id', tagValidator, validateRequest, tagController.updateTag);
router.delete('/tags/:id', tagController.deleteTag);

module.exports = router;
