const { v4: uuidv4 } = require("uuid");
const Generation = require("../models/Generation");

//  IMPORTANT: if you renamed file → aiService.js
const { generateClipart } = require("../services/aiService");

const {
  processImage,
  validateImageBuffer,
  uploadToImgBB,
} = require("../services/imageService");

const generateCliparts = async (req, res) => {
  const { imageBase64, styles, customPrompt = "" } = req.body;

  // Validate image
  const isValidImage = await validateImageBuffer(imageBase64);
  if (!isValidImage) {
    return res.status(400).json({
      success: false,
      message: "Invalid image",
    });
  }

  let processedBase64;
  let imageUrl;

  try {
    // Compress image
    processedBase64 = await processImage(imageBase64);

    //  Upload to ImgBB
    imageUrl = await uploadToImgBB(processedBase64);
  } catch (err) {
    return res.status(422).json({
      success: false,
      message: err.message,
    });
  }

  const sessionId = uuidv4();

  // CREATE DB RECORD ( added originalImageUrl)
  const generation = await Generation.create({
    sessionId,
    originalImageUrl: imageUrl,
    styles: styles.map((s) => ({ style: s, status: "pending" })),
    customPrompt,
    status: "processing",
  });

  // Immediate response
  res.status(202).json({
    success: true,
    sessionId,
    generationId: generation._id,
  });

  // Background processing
  runGenerations(generation._id, imageUrl, styles, customPrompt);
};

const runGenerations = async (generationId, imageUrl, styles, customPrompt) => {
  for (const style of styles) {
    try {
      //  HuggingFace ignores imageUrl but we keep it (future upgrade)
      const resultUrl = await generateClipart(imageUrl, style, customPrompt);

      await Generation.updateOne(
        { _id: generationId, "styles.style": style },
        {
          $set: {
            "styles.$.status": "completed",
            "styles.$.resultUrl": resultUrl,
            "styles.$.completedAt": new Date(),
          },
        },
      );
    } catch (err) {
      console.error(style, err.message);

      await Generation.updateOne(
        { _id: generationId, "styles.style": style },
        {
          $set: {
            "styles.$.status": "failed",
            "styles.$.error": err.message,
          },
        },
      );
    }

    // prevent rate limit
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Update final status properly
  const doc = await Generation.findById(generationId);

  const allCompleted = doc.styles.every((s) => s.status === "completed");
  const allFailed = doc.styles.every((s) => s.status === "failed");

  let finalStatus = "partial";
  if (allCompleted) finalStatus = "completed";
  if (allFailed) finalStatus = "failed";

  await Generation.findByIdAndUpdate(generationId, {
    status: finalStatus,
  });
};

const getGenerationStatus = async (req, res) => {
  const { sessionId } = req.params;

  const generation = await Generation.findOne({ sessionId });

  if (!generation) {
    return res.status(404).json({
      success: false,
      message: "Generation not found",
    });
  }

  res.json({
    success: true,
    status: generation.status,
    styles: generation.styles,
  });
};

module.exports = { generateCliparts, getGenerationStatus };
