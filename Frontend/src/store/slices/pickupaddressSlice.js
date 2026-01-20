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

export const CreatePickAdd = createAsyncThunk(
  "admin/CreatePickAdd",
  async (values, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Token"); 


      const response = await axios.post(
        `${BaseUrl}/addPickupaddress`,
        {
          pickup_location:values?.pickup_location,
          name:values?.name,
          phone:values?.phone,
          email:values?.email,
          address:values?.address,
          landmark:values?.landmark,
          city:values?.city,
          state:values?.state,
          country:values?.country,
          pincode:values?.pincode
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
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
      })

      .addCase(CreatePickAdd.pending, (state) => {
        state.loading = true;
        state.message = 'Fetching Create PickAdd...';
      })
      .addCase(CreatePickAdd.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Fetched Create PickAdd successfully.';
      })
      .addCase(CreatePickAdd.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || 'Failed to fetch Create PickAdd.';
      });
  },
});

export default pickupaddressSlice.reducer;
