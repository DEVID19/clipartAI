import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import generationReducer from "./slices/generationSlice";
import historyReducer from "./slices/historySlice";
import uiReducer from "./slices/uiSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["history"], // only persist history
};

const rootReducer = combineReducers({
  generation: generationReducer,
  history: historyReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
