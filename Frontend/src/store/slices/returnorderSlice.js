import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BaseUrl = "http://localhost:5000/api"
const token = localStorage.getItem("Token")

export const GetAllReturnOrders = createAsyncThunk(
  "return/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseUrl}/getAllOrder`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const raw = response.data;
      const list = Array.isArray(raw) ? raw : (Array.isArray(raw.data) ? raw.data : []);

      const returnRaw = list.filter((o) => {
        if (o == null) return false;
        if (o.is_return === 1) return true;
        const st = (o.status || '').toString().toLowerCase();
        if (st.includes('return')) return true;
        if (o.status === 'return') return true;
        return false;
      });

      const returnOrders = returnRaw.map((item) => {
        if (item._id && item.shippingInfo) return item;

        const id = item._id || item.id || item.channel_order_id || item.order_id || `${item.id}`;

        const shippingInfo = {
          firstName: item.customer_name || item.others?.shipping_name || '',
          lastName: '',
          phone: item.customer_phone || item.others?.shipping_phone || '',
          email: item.customer_email || item.others?.shipping_email || '',
          address: item.customer_address || item.others?.shipping_address || item.pickup_address_detail?.address || '',
          city: item.customer_city || item.others?.shipping_city || '',
          state: item.customer_state || item.others?.shipping_state || '',
          country: item.customer_country || item.others?.shipping_country || '',
          pincode: Number(item.customer_pincode || item.others?.shipping_pincode || item.pickup_address_detail?.pin_code || 0)
        };

        const items = (item.products || item.order_items || []).map((p) => ({
          name: p.name || p.sku || '',
          qty: Number(p.quantity || p.units || 0),
          price: Number(p.price || p.selling_price || 0)
        }));

        const dim = { length: 0, breadth: 0, height: 0, weight: Number(item.others?.weight || item.shipments?.[0]?.weight || 0) };
        const dimStr = item.shipments?.[0]?.dimensions || item.others?.dimensions || item.dimensions || '';
        if (typeof dimStr === 'string' && dimStr.includes('x')) {
          const parts = dimStr.split('x').map(s => Number(s) || 0);
          dim.length = parts[0] || 0;
          dim.breadth = parts[1] || 0;
          dim.height = parts[2] || 0;
        }

        const subTotal = Number(item.total || item.sub_total || item.total_amount || 0) || 0;
        const returnShipmentId = item.return_pickup_data?.id || item.shipments?.[0]?.return_awb || item.returnShipmentId || null;

        return {
          _id: id,
          shippingInfo,
          items,
          dimension: dim,
          subTotal,
          returnShipmentId,
          returnStatus: item.status,
          raw: item
        };
      });

      return returnOrders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
)

const initialState = {
  returnOrders: [],
  loading: false,
  error: null,
  success: false,
  message: ""
};

const returnOrderSlice = createSlice({
  name: 'returnOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllReturnOrders.pending, (state) => {
        state.loading = true;
        state.message = "Fetching return orders...";
      })
      .addCase(GetAllReturnOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.returnOrders = action.payload;
        state.message = "Fetched return orders successfully.";
      })
      .addCase(GetAllReturnOrders.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch return orders";
      })
  }
});

export default returnOrderSlice.reducer;
