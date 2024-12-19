// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import Userslice  from '../Features/Userslice';
import  ThemeSlice  from '../Features/Themeslice';

export const store = configureStore({
  reducer: {
    loggedin: Userslice,
    theme: ThemeSlice
  },
});
