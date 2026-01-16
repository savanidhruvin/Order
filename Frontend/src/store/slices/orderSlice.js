import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Add order
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    
    // Update order
    updateOrder: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.orders.findIndex(order => order.id === id);
      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], ...updatedData };
      }
    },
    
    // Delete order
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(order => order.id !== action.payload);
    },
    
    // Set orders
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    
    // Set loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addOrder,
  updateOrder,
  deleteOrder,
  setOrders,
  setLoading,
  setError,
} = orderSlice.actions;

export default orderSlice.reducer;

