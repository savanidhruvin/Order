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
  async ({values , subTotals}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Token"); 

      const items = values.products.map((item) => ({
        name: item.productName,
        qty: Number(item.quantity),
        price: Number(item.unitPrice),
        discount: Number(item.discount) || 0,
        tax: Number(item.taxRate) || 0,
      }));

      const response = await axios.post(
        `${BaseUrl}/createOrder`,
        {
          items,
          shippingInfo: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.mobile,
            address: values.address,
            city: values.city,
            state: values.state,
            pincode: values.pincode,
            country:values.country
          },
          dimension: {
            length: values.length,
            breadth: values.breadth,
            height: values.height,
            weight: values.deadWeight,
          },
          subTotal: subTotals
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

export const CreateOrderCheck = createAsyncThunk(
  "admin/CreateOrderCheck",
  async ({pincode , weight}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Token"); 

      const response = await axios.post(
        `${BaseUrl}/checkAvailbility`,
        {
          deliveryPincode:pincode,
          weight:weight
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

export const CreateManShip = createAsyncThunk(
  "admin/CreateManShip",
  async ({orderId , id}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Token"); 

      const response = await axios.post(
        `${BaseUrl}/mannualShipment/${orderId}`,
        {
          courierId:id
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

export const CancelOrder = createAsyncThunk(
  "admin/CancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Token");

      const response = await axios.put(
        `${BaseUrl}/cancleOrder/${orderId}`,
        {}, 
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

    .addCase(CreateOrderCheck.pending, (state, action) => {
      state.loading = true;
      state.message = "Fetching Create OrderCheck..."
    })
    .addCase(CreateOrderCheck.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true
      state.message = "Fetching Create OrderCheck Successfully..."
    })
    .addCase(CreateOrderCheck.rejected, (state, action) => {
      state.loading = false
      state.success = false
      state.message = action.payload?.message || "Failed to Create OrderCheck";
    })

    .addCase(CreateManShip.pending, (state, action) => {
      state.loading = true;
      state.message = "Fetching Create ManShip..."
    })
    .addCase(CreateManShip.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true
      state.message = "Fetching Create ManShip Successfully..."
    })
    .addCase(CreateManShip.rejected, (state, action) => {
      state.loading = false
      state.success = false
      state.message = action.payload?.message || "Failed to Create ManShip";
    })

    .addCase(CancelOrder.pending, (state, action) => {
      state.loading = true;
      state.message = "Fetching Cancel Order..."
    })
    .addCase(CancelOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true
      state.message = "Fetching Cancel Order Successfully..."
    })
    .addCase(CancelOrder.rejected, (state, action) => {
      state.loading = false
      state.success = false
      state.message = action.payload?.message || "Failed to Cancel Order";
    })
  }
});

export const { } = orderSlice.actions;

export default orderSlice.reducer;

