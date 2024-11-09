const express = require('express');
const { registerUser, loginUser, deleteUser } = require('./userController');
const authenticateToken = require('./authMiddleware');
const { isAdmin } = require('./roleMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin-only route to delete a user
router.delete('/users/:id', authenticateToken, isAdmin, deleteUser);

module.exports = router;
