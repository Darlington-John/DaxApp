import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeContactId: null, // Track the active contact by its ID
};

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setActiveContact: (state, action) => {
      state.activeContactId = action.payload;
    },
  },
});

export const { setActiveContact } = contactSlice.actions;
export default contactSlice.reducer;
