import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const BaseUrl = "http://localhost:5000/api"

export const GetAllOrder = createAsyncThunk(
  "admin/getapplication",
  async (_, { rejectWithValue }) => {
      try {

          const response = await axios.get(`${BaseUrl}/getAllOrder`, {
              // headers: {
              //     Authorization: `Bearer ${token}`
              // }
          })

          return response.data
      } catch (error) {
          return rejectWithValue(
              error.response?.data || { message: "Unexpected error occurred" }
          );
      }
  }
)

const initialState = {
  orders: [],
  loading: false,
  error: null,
  success:false,
  message:""
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
     
  },
  extraReducers: (builder) => {
    builder
    .addCase(GetAllOrder.pending, (state, action) => {
      state.loading = true;
      state.message = "Fetching Get AllOrder..."
    })
    .addCase(GetAllOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true
      state.orders = action.payload
      state.message = "Fetching AllOrder Successfully..."
    })
    .addCase(GetAllOrder.rejected, (state, action) => {
      state.loading = false
      state.success = false
      state.message = action.payload?.message || "Failed to get AllOrder";
    })
  }
});

export const { } = orderSlice.actions;

export default orderSlice.reducer;

