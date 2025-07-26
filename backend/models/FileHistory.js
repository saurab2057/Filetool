import mongoose from 'mongoose';

const FileHistorySchema = new mongoose.Schema({
  // A reference to the user who performed the conversion
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This links it to your User model
    required: true,
  },
  
  // The name of the file AFTER conversion
  filename: {
    type: String,
    required: true,
  },

  // The format of the converted file (e.g., 'mp4', 'mp3', 'jpg')
  format: {
    type: String, 
  },

  // The size of the converted file in bytes
  sizeInBytes: {
    type: Number,
  },

  // The timestamp for when the conversion was completed
  processedAt: {
    type: Date,
    default: Date.now,
  },
});

const FileHistory = mongoose.model('FileHistory', FileHistorySchema);

export default FileHistory;