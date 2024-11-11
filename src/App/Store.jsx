// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import Userslice  from '../Features/Userslice';

export const store = configureStore({
  reducer: {
    loggedin: Userslice
  },
});
