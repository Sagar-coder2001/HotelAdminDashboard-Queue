// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import TokensliceReducer from '../Features/Tokenslice'; // Import the reducer, not the action

export const store = configureStore({
  reducer: {
    category: TokensliceReducer,  // Use the reducer from the slice
  },
});
