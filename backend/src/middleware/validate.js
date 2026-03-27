const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_SIZE_BYTES = (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024;

const VALID_STYLES = ['cartoon', 'flat_illustration', 'anime', 'pixel_art', 'sketch'];

const validateImageUpload = (req, res, next) => {
  const { imageBase64, mimeType } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ success: false, message: 'No image provided.' });
  }

  if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
    });
  }

  // Estimate base64 size
  const estimatedBytes = (imageBase64.length * 3) / 4;
  if (estimatedBytes > MAX_SIZE_BYTES) {
    return res.status(413).json({
      success: false,
      message: `Image too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 10}MB.`,
    });
  }

  next();
};

const validateStyles = (req, res, next) => {
  const { styles } = req.body;

  if (!styles || !Array.isArray(styles) || styles.length === 0) {
    return res.status(400).json({ success: false, message: 'At least one style must be selected.' });
  }

  const invalidStyles = styles.filter((s) => !VALID_STYLES.includes(s));
  if (invalidStyles.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid styles: ${invalidStyles.join(', ')}`,
    });
  }

  if (styles.length > 5) {
    return res.status(400).json({ success: false, message: 'Maximum 5 styles per request.' });
  }

  next();
};

module.exports = { validateImageUpload, validateStyles };
