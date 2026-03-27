const Generation = require("../models/Generation");

// GET /api/history/:sessionId

const getHistory = async (req, res) => {
  const { sessionId } = req.params;

  const generations = await Generation.find({ sessionId })
    .sort({ createdAt: -1 })
    .limit(20)
    .select("-__v");

  res.json({
    success: true,
    count: generations.length,
    generations,
  });
};

// DELETE /api/history/:generationId

const deleteGeneration = async (req, res) => {
  const { generationId } = req.params;

  const result = await Generation.findByIdAndDelete(generationId);
  if (!result) {
    return res.status(404).json({ success: false, message: "Not found." });
  }

  res.json({ success: true, message: "Deleted successfully." });
};

module.exports = { getHistory, deleteGeneration };
