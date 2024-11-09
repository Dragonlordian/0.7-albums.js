const express = require('express');
const { getAllAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } = require('./albumController');
const authenticateToken = require('./authMiddleware');
const { isAdmin, isOwnerOrAdmin } = require('./roleMiddleware');

const router = express.Router();

// Public route
router.get('/', getAllAlbums);

// Routes accessible by regular users and admins
router.post('/', authenticateToken, createAlbum);
router.get('/:id', authenticateToken, getAlbumById);

// Routes accessible only to the album owner or admin
router.put('/:id', authenticateToken, isOwnerOrAdmin, updateAlbum);
router.delete('/:id', authenticateToken, isOwnerOrAdmin, deleteAlbum);

module.exports = router;
