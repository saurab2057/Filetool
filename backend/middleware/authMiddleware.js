// authMiddleware.js - SECURE VERSION
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

dotenv.config();
const jwtSecret = process.env.SECRET_KEY;

// 2. Make the function async
export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 3. Verify the token just to get the ID
    const decoded = jwt.verify(token, jwtSecret);

    // 4. FETCH THE LATEST USER DATA FROM THE DATABASE
    // We assume the user's ID is stored in the token as `id` or `_id`. Adjust if needed.
    // .select('-password') prevents the password hash from being attached to the request.
    const freshUser = await User.findById(decoded.userInfo.id).select('-password');

    if (!freshUser) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    // 5. Attach the FRESH user object to the request
    req.user = freshUser;

    next();

  } catch (err) {
    // Catches errors from jwt.verify and User.findById
    return res.status(403).json({ message: 'Token is not valid or has expired' });
  }
}

// Your isAdmin middleware now works perfectly with fresh data!
export function isAdmin(req, res, next) {
  if (req.user?.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Requires admin privileges.' });
  }
}
