// backend/routes/userRoute.js
import express from 'express';
import User from '../models/User.js';
import {authenticateToken, isAdmin} from '../middleware/authMiddleware.js';
import parser from '../middleware/cloudinary.js'; // Import the Cloudinary parser if needed

const router = express.Router();

// --- GET CURRENT USER DATA ---
// GET /api/user/ (Note: we apply middleware here)
router.get('/', authenticateToken, async (req, res) => {
    try {
        // req.user.id is attached by the authenticateToken middleware
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user);
    } catch (err) {
        console.error('Fetch User Error:', err.message);
        res.status(500).json({ message: 'Server error fetching user data.' });
    }
});

// --- UPDATE USER PROFILE ---
// PUT /api/user/profile
router.put('/profile', [authenticateToken, parser.single('profilePicture')], async (req, res) => {
    try {
        // 1. Find the user document we need to work with.
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Conditionally update the user object in memory.
        const { name } = req.body;
        let hasChanges = false;

        // Check if a new name was provided and is different from the old one.
        if (name && name !== user.name) {
            user.name = name;
            hasChanges = true;
        }

        // Check if the Cloudinary middleware uploaded a file.
        if (req.file) {
            user.profilePictureUrl = req.file.path; // The URL from Cloudinary
            hasChanges = true;
        }

        // 3. If any changes were made, save the document.
        // The .save() method is efficient and will only hit the database if there are modifications.
        if (hasChanges) {
            await user.save();
        }

        // 4. ALWAYS fetch the latest user data from the database and send it back.
        // This ensures the frontend receives the definitive, most current state.
        const updatedUser = await User.findById(req.user.id).select('-password');

        res.json({
            message: 'Profile updated successfully.',
            user: updatedUser, // This now always contains the latest data from the DB
        });

    } catch (err) {
        console.error('Update Profile Error:', err.message);
        res.status(500).json({ message: 'Server error updating profile.' });
    }
});

export default router;