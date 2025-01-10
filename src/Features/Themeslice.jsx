// src/Features/ThemeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const storedTheme = localStorage.getItem('theme') || 'white';
const initialState = storedTheme === 'white' ? {
  value: 'white',
  navbar: '#cef4f4',
  textcolor: 'black',
  modal: 'whitesmoke',
  hover: 'white'
} : {
  value: '#092635',
  navbar: '#1B4242',
  textcolor: 'white',
  modal: '#123030',
  hover:'#1e4a4a'
};

export const ThemeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    white: (state) => {
      state.value = 'white';
      state.navbar = '#cef4f4';
      state.textcolor = 'black';
      state.modal = 'whitesmoke';
      state.hover = 'white'
      localStorage.setItem('theme', 'white'); // Store in localStorage
    },
    dark: (state) => {
      state.value = '#092635';
      state.navbar = '#1B4242';
      state.textcolor = 'white';
      state.modal = '#123030';
      state.hover = '#1e4a4a'
      localStorage.setItem('theme', 'dark'); // Store in localStorage
    },
  },
});

// Export actions
export const { white, dark } = ThemeSlice.actions;

export default ThemeSlice.reducer;
