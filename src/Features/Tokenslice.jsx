// src/redux/selectedProductSlice.js
import { createSlice } from '@reduxjs/toolkit';

const Tokenslice = createSlice({
  name: "category",

  initialState: {
    role: null,
    username: null,
  },


  initialState: null,
  reducers: {
    selectCategory: (state, action) => {
      state.role = action.payload.Role; 
      state.username = action.payload.Username;  
    }
  }
});

export const { selectCategory } = Tokenslice.actions;
export default Tokenslice.reducer;
