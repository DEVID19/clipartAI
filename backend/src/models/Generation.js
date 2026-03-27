const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    originalImageUrl: {
      type: String,
    },
    styles: [
      {
        style: {
          type: String,
          enum: ['cartoon', 'flat_illustration', 'anime', 'pixel_art', 'sketch'],
          required: true,
        },
        resultUrl: String,
        status: {
          type: String,
          enum: ['pending', 'processing', 'completed', 'failed'],
          default: 'pending',
        },
        prompt: String,
        error: String,
        completedAt: Date,
      },
    ],
    customPrompt: {
      type: String,
      maxlength: 500,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'partial', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Auto-expire records after 7 days
generationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

const Generation = mongoose.model('Generation', generationSchema);
module.exports = Generation;
