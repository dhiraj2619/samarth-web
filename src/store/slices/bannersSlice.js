import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, toRejectValue } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";

// Hero slider banners
export const fetchBanners = createAsyncThunk(
  "banners/fetchAll",
  async (_, { rejectWithValue, signal }) => {
    try {
      return await api.get(ENDPOINTS.banners, { signal });
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  },
  {
    condition: (_, { getState }) => getState().banners.status === "idle",
  }
);

const bannersSlice = createSlice({
  name: "banners",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload) ? action.payload : action.payload?.items ?? [];
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? action.error.message;
      });
  },
});

export const selectBanners = (state) => state.banners.items;
export const selectBannersStatus = (state) => state.banners.status;

export default bannersSlice.reducer;
