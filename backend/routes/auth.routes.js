// routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRequest, schemas } = require('../middleware/validation.middleware');
const { verifyToken } = require('../middleware/auth.middleware');

// Public routes
router.post(
  '/signup',
  validateRequest(schemas.signup),
  authController.signup
);

router.post(
  '/login',
  validateRequest(schemas.login),
  authController.login
);

router.post(
  '/request-password-reset',
  validateRequest(schemas.requestReset),
  authController.requestPasswordReset
);

router.post(
  '/reset-password',
  validateRequest(schemas.resetPassword),
  authController.resetPassword
);

// Protected routes
router.get(
  '/profile',
  verifyToken,
  authController.getProfile
);

router.put(
  '/profile',
  verifyToken,
  validateRequest(schemas.updateProfile),
  authController.updateProfile
);

router.post(
  '/change-password',
  verifyToken,
  validateRequest(schemas.changePassword),
  authController.changePassword
);

// Test route to verify auth is working
router.get(
  '/test-auth',
  verifyToken,
  (req, res) => {
    res.json({
      message: "Protected route accessed successfully",
      user: req.user
    });
  }
);

module.exports = router;