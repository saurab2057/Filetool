// models/UserMetadata.js
import mongoose from 'mongoose';

const metadataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ip: String,
  location: {
    country: String,
    region: String,
    city: String,
  },
  device: {
    type: new mongoose.Schema({
      type: String,
      browser: String,
      os: String,
    }, { _id: false }) // <- Important to prevent nested _id field
  },
  userAgent: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('UserMetadata', metadataSchema);

