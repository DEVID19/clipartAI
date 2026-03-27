const sharp = require("sharp");
const axios = require("axios");

const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 85;

// Process and compress image from base64

const processImage = async (base64) => {
  const buffer = Buffer.from(base64, "base64");

  const processed = await sharp(buffer)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: JPEG_QUALITY, progressive: true })
    .toBuffer();

  return processed.toString("base64");
};

// Validate image buffer

const validateImageBuffer = async (base64) => {
  try {
    const buffer = Buffer.from(base64, "base64");
    const metadata = await sharp(buffer).metadata();
    return metadata.width > 0 && metadata.height > 0;
  } catch {
    return false;
  }
};

// Upload to ImgBB → returns public URL

const uploadToImgBB = async (base64) => {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("IMGBB_API_KEY missing in .env");
  }

  const formData = new URLSearchParams();
  formData.append("image", base64);

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    formData
  );

  return response.data.data.url;
};

module.exports = {
  processImage,
  validateImageBuffer,
  uploadToImgBB,
};