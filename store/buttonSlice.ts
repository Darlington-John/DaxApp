import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeButtonIndex:
    typeof window !== 'undefined' && localStorage.getItem('activeButtonIndex')
      ? Number(localStorage.getItem('activeButtonIndex'))
      : 0, // Load from localStorage only in the browser
};


const buttonSlice = createSlice({
  name: 'buttons',
  initialState,
  reducers: {
    setActiveButton: (state, action) => {
      state.activeButtonIndex = action.payload;
      // Save the active button index to localStorage (only in the browser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeButtonIndex', action.payload.toString());
      }
    },
  },
});

export const { setActiveButton } = buttonSlice.actions;
export default buttonSlice.reducer;
