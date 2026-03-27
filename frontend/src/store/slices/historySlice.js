import { createSlice } from "@reduxjs/toolkit";

const historySlice = createSlice({
  name: "history",
  initialState: {
    items: [], // [{ id, timestamp, styles: [{ style, resultUrl }], thumbnail }]
  },
  reducers: {
    addHistoryItem(state, action) {
      state.items.unshift(action.payload);
      // Keep only last 20 items
      if (state.items.length > 20) {
        state.items = state.items.slice(0, 20);
      }
    },
    removeHistoryItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearHistory(state) {
      state.items = [];
    },
  },
});

export const { addHistoryItem, removeHistoryItem, clearHistory } =
  historySlice.actions;
export default historySlice.reducer;
