import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './reducers';

const store = configureStore({
  reducer: {
    poll: pollReducer,
  },
});

export default store;
