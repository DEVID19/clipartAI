const axios = require("axios");

const HF_API_URL =
  "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0";

const STYLE_PROMPTS = {
  cartoon: "cartoon character, disney pixar style, vibrant colors",
  flat_illustration: "flat illustration, minimal vector style",
  anime: "anime style portrait, clean lines, vibrant colors",
  pixel_art: "pixel art character, 16-bit retro style",
  sketch: "pencil sketch portrait, black and white",
};

const generateClipart = async (imageUrl, style, customPrompt = "") => {
  const basePrompt = STYLE_PROMPTS[style];

  const prompt = customPrompt ? `${basePrompt}, ${customPrompt}` : basePrompt;

  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          Accept: "image/png",
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
        timeout: 60000,
      },
    );

    const base64 = Buffer.from(response.data).toString("base64");

    return `data:image/png;base64,${base64}`;
  } catch (err) {
    if (err.response?.data) {
      try {
        const errorText = Buffer.from(err.response.data).toString();
        console.error("HF ERROR:", errorText);
      } catch {
        console.error("HF ERROR:", err.message);
      }
    } else {
      console.error("HF ERROR:", err.message);
    }

    throw new Error("HuggingFace generation failed");
  }
};

module.exports = { generateClipart };
