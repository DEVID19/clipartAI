import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generationAPI } from "../../services/api";

// Async thunk: start generation
export const startGeneration = createAsyncThunk(
  "generation/start",
  async (
    { imageBase64, mimeType, styles, customPrompt },
    { rejectWithValue },
  ) => {
    try {
      const data = await generationAPI.generate({
        imageBase64,
        mimeType,
        styles,
        customPrompt,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Generation failed",
      );
    }
  },
);

// Async thunk: poll status
export const pollStatus = createAsyncThunk(
  "generation/pollStatus",
  async (sessionId, { rejectWithValue }) => {
    try {
      const data = await generationAPI.getStatus(sessionId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const STYLE_LABELS = {
  cartoon: "Cartoon",
  flat_illustration: "Flat Art",
  anime: "Anime",
  pixel_art: "Pixel Art",
  sketch: "Sketch",
};

const initialState = {
  // Upload
  selectedImage: null, // { uri, base64, mimeType, width, height }
  selectedStyles: ["cartoon", "anime", "sketch"],
  customPrompt: "",

  // Generation flow
  sessionId: null,
  generationId: null,
  overallStatus: "idle", // idle | starting | processing | completed | partial | failed

  // Per-style results
  styleResults: [], // [{ style, status, resultUrl, error }]

  // UI
  error: null,
  startedAt: null,
};

const generationSlice = createSlice({
  name: "generation",
  initialState,
  reducers: {
    setSelectedImage(state, action) {
      state.selectedImage = action.payload;
      // Reset previous results when new image picked
      state.sessionId = null;
      state.generationId = null;
      state.overallStatus = "idle";
      state.styleResults = [];
      state.error = null;
    },
    toggleStyle(state, action) {
      const style = action.payload;
      const idx = state.selectedStyles.indexOf(style);
      if (idx >= 0) {
        if (state.selectedStyles.length > 1) {
          state.selectedStyles.splice(idx, 1);
        }
      } else {
        state.selectedStyles.push(style);
      }
    },
    setCustomPrompt(state, action) {
      state.customPrompt = action.payload;
    },
    resetGeneration(state) {
      Object.assign(state, initialState);
    },
    updateStyleResult(state, action) {
      // Update a single style result from polling
      const { style, status, resultUrl, error } = action.payload;
      const existing = state.styleResults.find((r) => r.style === style);
      if (existing) {
        existing.status = status;
        if (resultUrl) existing.resultUrl = resultUrl;
        if (error) existing.error = error;
      }
    },
  },
  extraReducers: (builder) => {
    // startGeneration
    builder.addCase(startGeneration.pending, (state) => {
      state.overallStatus = "starting";
      state.error = null;
      state.startedAt = Date.now();
      // Initialize style results as pending
      state.styleResults = state.selectedStyles.map((style) => ({
        style,
        label: STYLE_LABELS[style] || style,
        status: "pending",
        resultUrl: null,
        error: null,
      }));
    });
    builder.addCase(startGeneration.fulfilled, (state, action) => {
      state.sessionId = action.payload.sessionId;
      state.generationId = action.payload.generationId;
      state.overallStatus = "processing";
    });
    builder.addCase(startGeneration.rejected, (state, action) => {
      state.overallStatus = "failed";
      state.error = action.payload;
    });

    // pollStatus
    builder.addCase(pollStatus.fulfilled, (state, action) => {
      const { status, styles } = action.payload;
      state.overallStatus = status;
      // Merge style results
      styles.forEach((styleData) => {
        const existing = state.styleResults.find(
          (r) => r.style === styleData.style,
        );
        if (existing) {
          existing.status = styleData.status;
          if (styleData.resultUrl) existing.resultUrl = styleData.resultUrl;
          if (styleData.error) existing.error = styleData.error;
        }
      });
    });
  },
});

export const {
  setSelectedImage,
  toggleStyle,
  setCustomPrompt,
  resetGeneration,
  updateStyleResult,
} = generationSlice.actions;

export default generationSlice.reducer;
