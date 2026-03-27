import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    activeTab: "home",
    fullscreenImage: null, // { uri, style }
    toastMessage: null,
    toastType: "info", // info | success | error
  },
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    openFullscreen(state, action) {
      state.fullscreenImage = action.payload;
    },
    closeFullscreen(state) {
      state.fullscreenImage = null;
    },
    showToast(state, action) {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type || "info";
    },
    hideToast(state) {
      state.toastMessage = null;
    },
  },
});

export const {
  setActiveTab,
  openFullscreen,
  closeFullscreen,
  showToast,
  hideToast,
} = uiSlice.actions;
export default uiSlice.reducer;
