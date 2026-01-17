import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const BaseUrl = "http://localhost:5000/api"
const token = localStorage.getItem("Token")

export const GetAllOrder = createAsyncThunk(
  "admin/getapplication",
  async (_, { rejectWithValue }) => {
      try {

          const response = await axios.get(`${BaseUrl}/getAllOrder`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          })

          return response.data
      } catch (error) {
          return rejectWithValue(
              error.response?.data || { message: "Unexpected error occurred" }
          );
      }
  }
)

export const CreateOrder = createAsyncThunk(
  "admin/CreateOrder",
  async (values, { rejectWithValue }) => {
      try {
 
         const items = values.products.map((item) => ({
            name: item.productName,
            qty: Number(item.quantity),
            price: Number(item.unitPrice),
            discount: Number(item.discount) || 0,
            tax: Number(item.taxRate) || 0,
         }));
          const response = await axios.post(`${BaseUrl}/createOrder`, { 
              headers: {
                  Authorization: `Bearer ${token}`
              } 
          } ,{
            items,
            shippingInfo:{
              firstName:"",
              lastName:"",
              email:"",
              phone:values,
              address:values,
              city: values,
              state: values,
              country: values,
              pincode: values
            }
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

    .addCase(CreateOrder.pending, (state, action) => {
      state.loading = true;
      state.message = "Fetching CreateOrder..."
    })
    .addCase(CreateOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true
      state.message = "Fetching CreateOrder Successfully..."
    })
    .addCase(CreateOrder.rejected, (state, action) => {
      state.loading = false
      state.success = false
      state.message = action.payload?.message || "Failed to CreateOrder";
    })
  }
});

export const { } = orderSlice.actions;

export default orderSlice.reducer;

