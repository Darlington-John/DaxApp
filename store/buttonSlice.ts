import { createSlice } from '@reduxjs/toolkit';

interface ButtonState {
  activeButtonIndex: number;
  previousButtonIndex: number | null; 
}

const initialState: ButtonState = {
  activeButtonIndex: 0, 
  previousButtonIndex: null, 
};

const buttonSlice = createSlice({
  name: 'buttons',
  initialState,
  reducers: {
    setActiveButton: (state, action) => {
      state.previousButtonIndex = state.activeButtonIndex; 
      state.activeButtonIndex = action.payload;
    },
    goToPreviousButton: (state) => {
      if (state.previousButtonIndex !== null) {
        
        state.activeButtonIndex = state.previousButtonIndex;

        
        if (typeof window !== 'undefined') {
          localStorage.setItem('activeButtonIndex', state.previousButtonIndex.toString());
        }
      }
    },
  },
});

export const { setActiveButton, goToPreviousButton } = buttonSlice.actions;
export default buttonSlice.reducer;
