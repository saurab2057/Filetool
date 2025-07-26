import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  // --- CHANGE #1: The Password Field is now conditionally required ---
  password: {
    type: String,
    // The password is ONLY required if the authProvider is 'email'.
    // `this` refers to the document being created.
    required: [
      function () { return this.authProvider === 'email'; },
      'Password is required for email and password signups.'
    ]
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  // --- CHANGE #2: The authProvider defaults to 'email' ---
  // This ensures the conditional validation above works for standard signups.
  authProvider: {
    type: String,
    required: true,
    default: 'email',
  },



  // --- CHANGE #3: The status field is added to track user state ---
  status: {
    type: String,
    enum: [ 'active', 'banned', 'flagged' ],
    default: 'active', // can be 'active', 'banned', 'flagged'
  },

  role: {
    type: String,
    enum: ['user', 'admin'], // The role can only be one of these values
    default: 'user', // By default, every new user is a 'user'
  },

  profilePictureUrl: {
    type: String,
  },

  refreshToken: {
    type: String,
  },

  // This allows users to have multiple file conversion histories.
  fileHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FileHistory'
  }],
});


// This pre-save hook for hashing remains the same and is still necessary.
// It safely skips hashing if there is no password.
UserSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});


const User = mongoose.model('User', UserSchema);

export default User;