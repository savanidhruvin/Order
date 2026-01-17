import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BaseUrl = "http://localhost:5000/api";

export const GetPickupAddresses = createAsyncThunk(
  'pickup/getPickupAddresses',
  async (_, { rejectWithValue }) => {
    try {
      // First get token from backend which calls Shiprocket auth
      const tokenResp = await axios.get(`${BaseUrl}/getToken`);
      const token = tokenResp?.data?.data;

      if (!token) {
        return rejectWithValue({ message: 'Failed to retrieve token' });
      }

      const response = await axios.get(`${BaseUrl}/pickupAddresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Unexpected error occurred' });
    }
  }
);

const initialState = {
  pickupAddresses: [],
  loading: false,
  success: false,
  message: '',
};

const pickupaddressSlice = createSlice({
  name: 'pickupAddresses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetPickupAddresses.pending, (state) => {
        state.loading = true;
        state.message = 'Fetching pickup addresses...';
      })
      .addCase(GetPickupAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // if API returns { success: "true", data: [...] } keep data property
        state.pickupAddresses = action.payload?.data ?? action.payload ?? [];
        state.message = 'Fetched pickup addresses successfully.';
      })
      .addCase(GetPickupAddresses.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || 'Failed to fetch pickup addresses.';
      });
  },
});

export default pickupaddressSlice.reducer;
