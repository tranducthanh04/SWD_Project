const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const validateRequest = require('../middlewares/validateRequest');
const {
  registerValidator,
  verifyEmailValidator,
  loginValidator,
  googleLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  refreshTokenValidator,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', registerValidator, validateRequest, authController.register);
router.post('/verify-email', verifyEmailValidator, validateRequest, authController.verifyEmail);
router.post('/login', loginValidator, validateRequest, authController.login);
router.post('/google-login', googleLoginValidator, validateRequest, authController.googleLogin);
router.post('/forgot-password', forgotPasswordValidator, validateRequest, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, validateRequest, authController.resetPassword);
router.post('/change-password', authenticate, changePasswordValidator, validateRequest, authController.changePassword);
router.post('/logout', authController.logout);
router.post('/refresh-token', refreshTokenValidator, validateRequest, authController.refreshToken);
router.get('/me', authenticate, authController.me);

module.exports = router;
