import express from 'express';
import {authenticateToken, isAdmin} from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import FileHistory from '../models/FileHistory.js';
import Config from '../models/Config.js';
import mongoose from 'mongoose';
import UserMetadata from '../models/UserMetadata.js';   

const router = express.Router();

// All routes in this file are protected and require admin privileges
router.use(authenticateToken, isAdmin);

// --- GET DASHBOARD STATS ---
router.get('/stats', async (req, res) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const totalUsers = await User.countDocuments();
        const successfulJobs = await FileHistory.countDocuments({ processedAt: { $gte: twentyFourHoursAgo } });
        // Assuming you add a 'status' field to FileHistory to track failures
        const failedJobs = 0; // Placeholder
        const serverLoad = Math.floor(Math.random() * (80 - 50 + 1)) + 50; // Dummy data

        res.json({
            totalUsers: { value: totalUsers },
            successfulJobs: { value: successfulJobs },
            failedJobs: { value: failedJobs },
            serverLoad: { value: `${serverLoad}%` }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats.', error: error.message });
    }
});

// --- GET ALL JOBS ---
router.get('/jobs', async (req, res) => {
    try {
        const jobs = await FileHistory.find().populate('userId', 'email name').sort({ processedAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs.', error: error.message });
    }
});

// --- GET ALL USERS WITH LATEST METADATA ---
router.get('/users', async (req, res) => {
    try {
        const usersWithMetadata = await User.aggregate([
            {
                // Stage 1: Lookup (Join) with the 'usermetadatas' collection
                // 'from' MUST be the exact name of your UserMetadata collection in MongoDB
                $lookup: {
                    from: 'usermetadatas',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'metadataEntries'
                }
            },
            {
                // Stage 2: Add a new field 'latestMetadata' by processing 'metadataEntries'
                $addFields: {
                    latestMetadata: {
                        $arrayElemAt: [
                            // Sort the metadataEntries array by createdAt descending and take the first element
                            {
                                $sortArray: {
                                    input: "$metadataEntries",
                                    sortBy: { createdAt: -1 } // Sort by creation date in descending order to get latest
                                }
                            },
                            0 // Get the first element (which is the latest after sorting)
                        ]
                    }
                }
            },
            {
                // Stage 3: Project (select/exclude) fields from the final output
                $project: {
                    password: 0,         // Exclude password
                    refreshToken: 0,     // Exclude refreshToken
                    metadataEntries: 0,  // Exclude the temporary array of all metadata entries
                    // You might want to include latestMetadata._id if you need it for any reason
                }
            }
        ]);

        res.json(usersWithMetadata);
    } catch (error) {
        console.error('Error fetching users with metadata:', error);
        res.status(500).json({ message: 'Error fetching users with metadata.', error: error.message });
    }
});

// --- UPDATE USER ---
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, role } = req.body; // Assuming you're passing 'role' from frontend for user type

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        if(status) user.status = status; // Requires 'status' field in User model
        if(role) user.role = role;       // Requires 'role' field in User model

        // --- IMPORTANT: UNCOMMENT THIS LINE FOR ACTUAL DATABASE UPDATE ---
        await user.save();

        // After updating the user, re-fetch the user with their latest metadata
        // to send the most up-to-date representation back to the client.
        const updatedUserResult = await User.aggregate([
             { $match: { _id: new mongoose.Types.ObjectId(id) } }, // Match the specific user by ID
             {
                $lookup: {
                    from: 'usermetadatas', // Your UserMetadata collection name
                    localField: '_id',
                    foreignField: 'user',
                    as: 'metadataEntries'
                }
            },
            {
                $addFields: {
                    latestMetadata: {
                        $arrayElemAt: [
                            {
                                $sortArray: {
                                    input: "$metadataEntries",
                                    sortBy: { createdAt: -1 }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                $project: {
                    password: 0,
                    refreshToken: 0,
                    metadataEntries: 0,
                }
            }
        ]);

        // updatedUserResult will be an array; we need the first element
        const updatedUser = updatedUserResult[0];

        res.json({ message: 'User updated successfully.', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user.', error: error.message });
    }
});

// --- GET SYSTEM CONFIGURATION ---
router.get('/config', async (req, res) => {
    try {
        const config = await Config.findOne({ key: 'main_config' });
        if (!config) {
            return res.status(404).json({ message: 'Configuration not found.' });
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching configuration.', error: error.message });
    }
});

// --- UPDATE SYSTEM CONFIGURATION ---
router.put('/config', async (req, res) => {
    try {
        const updatedConfig = req.body;
        // Remove key and IDs to prevent them from being changed
        delete updatedConfig.key;
        delete updatedConfig._id;
        delete updatedConfig.createdAt;
        delete updatedConfig.updatedAt;


        const config = await Config.findOneAndUpdate(
            { key: 'main_config' },
            { $set: updatedConfig },
            { new: true, upsert: true }
        );

        res.json({ message: 'Configuration saved successfully.', config });
    } catch (error) {
        res.status(500).json({ message: 'Error saving configuration.', error: error.message });
    }
});


export default router;