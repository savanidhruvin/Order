import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './slices/orderSlice';
import getorderReducer from './slices/pickupaddressSlice';

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    pickupAddresses: getorderReducer,
  },
});

export default store;

