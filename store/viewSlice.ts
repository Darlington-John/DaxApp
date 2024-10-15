import { createSlice } from '@reduxjs/toolkit';

interface ViewState {
  activeViewIndex: number;
  previousViewIndex: number | null; 
}

const initialState: ViewState = {
  activeViewIndex:  0, 
  previousViewIndex: null, 
};

const ViewSlice = createSlice({
  name: 'views',
  initialState,
  reducers: {
    setActiveView: (state, action) => {
      state.previousViewIndex = state.activeViewIndex; 
      state.activeViewIndex = action.payload;

    },
    goToPreviousView: (state) => {
      if (state.previousViewIndex !== null) {
        
        state.activeViewIndex = state.previousViewIndex;
      }
    },
  },
});

export const { setActiveView, goToPreviousView } = ViewSlice.actions;
export default ViewSlice.reducer;
