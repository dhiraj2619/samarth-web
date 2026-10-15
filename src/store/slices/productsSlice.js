import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, toRejectValue } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params, { rejectWithValue, signal }) => {
    try {
      return await api.get(ENDPOINTS.products, { params, signal });
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue, signal }) => {
    try {
      return await api.get(ENDPOINTS.productById(id), { signal });
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  }
);

const initialState = {
  items: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  selected: null,
  selectedStatus: "idle",
  selectedError: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selected = null;
      state.selectedStatus = "idle";
      state.selectedError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload) ? action.payload : action.payload?.items ?? [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError = action.payload?.message ?? action.error.message;
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;

export const selectProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectSelectedProduct = (state) => state.products.selected;

export default productsSlice.reducer;
