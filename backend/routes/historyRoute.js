// backend/routes/historyRoute.js
import express from 'express';
import {authenticateToken, isAdmin} from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// --- GET CONVERSION HISTORY FOR THE LOGGED-IN USER ---
// GET /api/history/
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Find the user by the ID that the authenticateToken middleware attached to the request.
        // Then, use .populate() to automatically replace the history ID references
        // in the user's 'fileHistory' array with the actual documents from the FileHistory collection.
        const userWithHistory = await User.findById(req.user.id).populate({
            path: 'fileHistory',
            options: { sort: { 'processedAt': -1 } } // Sort by most recent first
        });

        if (!userWithHistory) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Send the populated array of history documents back to the frontend.
        res.json(userWithHistory.fileHistory);

    } catch (err) {
        console.error('Fetch History Error:', err);
        res.status(500).json({ message: 'Server error fetching conversion history.' });
    }
});

export default router;