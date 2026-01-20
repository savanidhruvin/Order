import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './slices/orderSlice';
import getorderReducer from './slices/pickupaddressSlice';
import returnorder from './slices/returnorderSlice';
import addorder from './slices/addorderSlice';

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    pickupAddresses: getorderReducer,
    returnOrders: returnorder,
    addOrders: addorder,
  },
});

export default store;

