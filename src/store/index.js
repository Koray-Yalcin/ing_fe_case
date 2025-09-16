import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import langReducer from "./langSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    lang: langReducer,
  },
});

export default store;
