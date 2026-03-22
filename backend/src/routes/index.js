const express = require('express');

const authRoutes = require('./authRoutes');
const jobRoutes = require('./jobRoutes');
const savedJobRoutes = require('./savedJobRoutes');
const applicationRoutes = require('./applicationRoutes');
const reportRoutes = require('./reportRoutes');
const profileRoutes = require('./profileRoutes');
const adminRoutes = require('./adminRoutes');
const tagRoutes = require('./tagRoutes');
const enterpriseRoutes = require('./enterpriseRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/saved-jobs', savedJobRoutes);
router.use('/applications', applicationRoutes);
router.use('/reports', reportRoutes);
router.use('/profile', profileRoutes);
router.use('/admin', adminRoutes);
router.use('/tags', tagRoutes);
router.use('/enterprise', enterpriseRoutes);

module.exports = router;
