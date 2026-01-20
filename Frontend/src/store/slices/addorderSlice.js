import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BaseUrl = "http://localhost:5000/api";

export const AddPickupAddress = createAsyncThunk(
  'pickup/addPickupAddress',
  async (values, { rejectWithValue }) => {
    try {
      // first get shiprocket token from backend
      const tokenResp = await axios.get(`${BaseUrl}/getToken`);
      const token = tokenResp?.data?.data;

      if (!token) return rejectWithValue({ message: 'Failed to get token' });

      // Ensure payload has pickup_location set correctly:
      // Priority: values.pickup_location > values.selectedTag (or values.tag) > if selectedTag === 'Other' and values.addressNickname use that > default 'Home'
      const payload = { ...values };
      if (!payload.pickup_location) {
        const tag = payload.selectedTag || payload.tag || null;
        if (tag === 'Other') {
          payload.pickup_location = payload.addressNickname || 'Other';
        } else if (tag) {
          payload.pickup_location = tag;
        } else {
          payload.pickup_location = 'Home';
        }
      }

      const response = await axios.post(
        `${BaseUrl}/addPickupaddress`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
    //   const apiError =
    //     error.response?.data?.message ||
    //     error.response?.data?.error ||
    //     error.response?.data?.errors?.pickup_location?.[0] ||
    //     error.message ||
    //     'Failed to add pickup address';

    //   return rejectWithValue({ message: apiError });

    let apiError = 'Failed to add pickup address';

    const data = error.response?.data;
    const status = error.response?.status;

    if (typeof data === 'string') {
        apiError = data;
    }
    else if (data?.pickup_location?.[0]) {
        apiError = data.pickup_location[0];
    }
    else if (data?.errors?.pickup_location?.[0]) {
        apiError = data.errors.pickup_location[0];
    }
    else if (data?.message) {
        apiError = data.message;
    }
    
    else if (!status && error.message) {
        apiError = error.message;
    }

    return rejectWithValue({ message: apiError });
    }
  }
);

const initialState = {
  address: null,
  loading: false,
  success: false,
  message: ''
};

const addorderSlice = createSlice({
  name: 'addorder',
  initialState,
  reducers: {
    clearAddOrderState(state) {
      state.address = null;
      state.loading = false;
      state.success = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddPickupAddress.pending, (state) => {
        state.loading = true;
        state.message = 'Adding pickup address...';
      })
      .addCase(AddPickupAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.address = action.payload;
        state.message = 'Pickup address added successfully.';
      })
      .addCase(AddPickupAddress.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || 'Failed to add pickup address.';
      });
  }
});

export const { clearAddOrderState } = addorderSlice.actions;

export default addorderSlice.reducer;
