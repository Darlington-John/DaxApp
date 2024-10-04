
import { configureStore } from '@reduxjs/toolkit';
import buttonReducer from './buttonSlice';
import contactReducer from './contactSlice';
const store = configureStore({
  reducer: {
    buttons: buttonReducer,
    contacts: contactReducer,
  },
});

export default store;
