// backend/routes/authRoute.js
import express from 'express';
import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { Resend } from 'resend';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';
import {saveUserMetadata} from '../middleware/collectUserMetadata.js'; // Import the user metadata middleware

// --- [NEW] Import the validation tools ---
import { body, validationResult } from 'express-validator';

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);
const accessTokenSecret = process.env.SECRET_KEY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

// --- [NEW] Reusable helper function for any successful login ---
async function handleLoginSuccess(res, user) {
  try {
    // 1. Create a short-lived Access Token
    const accessToken = jwt.sign(
      { userInfo: { id: user.id, name: user.name, email: user.email, role: user.role } },
      accessTokenSecret,
      { expiresIn: '15m' } // Expires in 15 minutes
    );

    // 2. Create a long-lived Refresh Token
    const refreshToken = jwt.sign(
      { userId: user.id }, // Only need the ID for refresh
      refreshTokenSecret,
      { expiresIn: '7d' } // Expires in 7 days
    );

    // 3. Securely store the refresh token on the user document
    user.refreshToken = refreshToken;
    await user.save();

    // 4. Send the refresh token to the client in a secure, httpOnly cookie
    res.cookie('jwt_refresh', refreshToken, {
      httpOnly: true, // Prevents access from client-side JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'lax', // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000,// 7 days in milliseconds
      path: '/', // Available to all routes
    });

    // 5. Send the access token and user info back in the JSON response
    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePictureUrl: user.profilePictureUrl || null,
      createdAt: user.createdAt, // <<< ADDED THIS LINE
    };
    return res.json({ accessToken, user: userInfo });

  } catch (error) {
    console.error('Error in login success handler:', error);
    return res.status(500).json({ message: "Server error during token generation." });
  }
}

// --- [NEW] Reusable Validation Rule Chains ---
// Validation rules for user signup
const signupValidationRules = [
  body('email', 'Please enter a valid email address.')
    .isEmail()
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject('A user with this e-mail already exists.');
      }
    }),
  body('password', 'Password must be at least 8 characters long and contain a number, an uppercase and a lowercase letter.')
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 }),
  body('confirmPassword', 'Password confirmation does not match the password.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match the password.');
      }
      return true;
    }),
  body('name', 'Name cannot be empty.').not().isEmpty().trim().escape(),
];

// Validation rules for user login
const loginValidationRules = [
  body('email', 'Please enter a valid email.').isEmail().normalizeEmail(),
  body('password', 'Password field cannot be empty.').not().isEmpty(),
];

// Validation for forgot password
const forgotPasswordValidationRules = [
  body('email', 'Please enter a valid email address.').isEmail().normalizeEmail(),
];

// Validation for reset password
const resetPasswordValidationRules = [
  body('token', 'A reset token is required.').not().isEmpty(),
  body('newPassword', 'New password must be at least 8 characters long and strong.').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 }),
];

// --- [CORRECTED] GOOGLE AUTHENTICATION ---
// POST /api/auth/google
router.post('/google', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ message: 'Google access token missing.' });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { name, email, picture } = response.data;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        authProvider: 'google',
        profilePictureUrl: picture,
      });
      await user.save();
    } else {
      // Optional: Update picture if changed
      if (user.profilePictureUrl !== picture) {
        user.profilePictureUrl = picture;
        await user.save();
      }
    }

    await saveUserMetadata(req, user._id);
    console.log('✅ User metadata saved', user._id);

    return handleLoginSuccess(res, user);

  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(401).json({ message: 'Google authentication failed.' });
  }
});


// --- [REFACTORED] LOCAL SIGNUP ---
router.post('/signup', signupValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, name } = req.body;
    const user = new User({ email, password, name });
    await user.save();
    res.status(201).json({ message: 'User registered successfully. Please login.' });
  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});


// --- [REFACTORED] LOCAL LOGIN ---
router.post('/login', loginValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials or please use your social login provider.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    await saveUserMetadata(req, user._id);
    console.log('✅ User metadata saved', user._id);

    return handleLoginSuccess(res, user);

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// --- [REFACTORED] FORGOT PASSWORD ---
router.post('/forgot-password', forgotPasswordValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const resetToken = jwt.sign({ user: { id: user.id } }, accessTokenSecret, { expiresIn: '15m' });
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Your Password Reset Link',
        html: `<p>Hello ${user.name || 'User'},</p><p>Click this link to reset your password. It is valid for 15 minutes.</p><p><a href="${resetLink}"><strong>Reset Password</strong></a></p>`
      });
    }
    // Securely respond the same way whether the user exists or not
    res.status(200).json({ message: 'If this email is registered, a reset link will be sent.' });
  } catch (error) {
    console.error('Forgot Password Server Error:', error);
    res.status(500).json({ message: 'Server error during password reset process.' });
  }
});

// --- [REFACTORED] RESET PASSWORD ---
router.post('/reset-password', resetPasswordValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.user.id, { password: hashedPassword });
    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Your reset link is invalid or has expired.' });
    }
    res.status(500).json({ message: 'Server error while resetting password.' });
  }
});


// --- [NEW] REFRESH TOKEN ENDPOINT ---
router.post('/refresh-token', async (req, res) => {

  // Log the cookies received for debugging
  console.log('Cookies received by backend:', req.cookies);
  const token = req.cookies.jwt_refresh;
  if (!token) {
    console.log('Refresh attempt failed: No refresh token cookie found.');
    return res.status(401).json({ message: 'No refresh token provided.' });
  }

  try {
    const decoded = jwt.verify(token, refreshTokenSecret);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== token) {
      console.log('Refresh attempt failed: Token is invalid or does not match DB.');
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }

    // All checks pass, issue a new access token
    const accessToken = jwt.sign(
      { userInfo: { id: user.id, name: user.name, email: user.email , role: user.role} },
      accessTokenSecret,
      { expiresIn: '15m' }
    );
    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePictureUrl: user.profilePictureUrl || null,
      createdAt: user.createdAt, // <<< ADDED THIS LINE
    };

    // Log the successful refresh
    console.log('Refresh successful. New access token issued.');

    res.json({ accessToken, user: userInfo });

  } catch (err) {
    console.log('Refresh attempt failed: Token is expired or malformed.', err.name);
    return res.status(403).json({ message: 'Refresh token is invalid or expired.' });
  }
});


// --- [NEW] LOGOUT ENDPOINT ---
router.post('/logout', async (req, res) => {
  const token = req.cookies.jwt_refresh;
  if (token) {
    try {
      const decoded = jwt.verify(token, refreshTokenSecret);
      // Clear the refresh token in the DB to invalidate the session
      await User.findByIdAndUpdate(decoded.userId, { refreshToken: null });
    } catch (err) {
      // Ignore if token is invalid, just clear the cookie
    }
  }
  // Instruct the browser to clear the secure cookie
  res.clearCookie('jwt_refresh', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
  return res.sendStatus(204); // No Content
});

export default router;