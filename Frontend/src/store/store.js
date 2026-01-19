import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './slices/orderSlice';
import getorderReducer from './slices/pickupaddressSlice';
import returnorder from './slices/returnorderSlice';

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    pickupAddresses: getorderReducer,
    returnOrders: returnorder,
  },
});

export default store;

