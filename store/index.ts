
import { configureStore } from '@reduxjs/toolkit';
import buttonReducer from './buttonSlice';
import contactReducer from './contactSlice';
import viewReducer from './viewSlice';
const store = configureStore({
  reducer: {
    buttons: buttonReducer,
    contacts: contactReducer,
    views: viewReducer
  },
});

export default store;
