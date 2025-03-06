const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { validateRequest, schemas } = require('../middleware/validation.middleware');

// Admin only routes
router.get(
    '/list',
    [verifyToken, isAdmin],
    userController.listUsers
);

router.put(
    '/:userId/role',
    [
        verifyToken,
        isAdmin,
        validateRequest(schemas.updateRole)
    ],
    userController.updateUserRole
);

router.post(
    '/profile-image',
    verifyToken,
    userController.uploadProfileImage
);

module.exports = router;