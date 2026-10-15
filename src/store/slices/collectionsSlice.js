import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, toRejectValue } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";

export const fetchCollections = createAsyncThunk(
  "collections/fetchAll",
  async (params, { rejectWithValue, signal }) => {
    try {
      return await api.get(ENDPOINTS.collections, { params, signal });
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  },
  {
    // Skip refetching when collections are already loaded or loading
    condition: (_, { getState }) => getState().collections.status === "idle",
  }
);

export const fetchCollectionBySlug = createAsyncThunk(
  "collections/fetchBySlug",
  async (slug, { rejectWithValue, signal }) => {
    try {
      return await api.get(ENDPOINTS.collectionBySlug(slug), { signal });
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
  selected: null,
  selectedStatus: "idle",
  selectedError: null,
};

const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    resetCollections: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload) ? action.payload : action.payload?.items ?? [];
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? action.error.message;
      })
      .addCase(fetchCollectionBySlug.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchCollectionBySlug.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchCollectionBySlug.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError = action.payload?.message ?? action.error.message;
      });
  },
});

export const { resetCollections } = collectionsSlice.actions;

export const selectCollections = (state) => state.collections.items;
export const selectCollectionsStatus = (state) => state.collections.status;
export const selectCollectionsError = (state) => state.collections.error;
export const selectSelectedCollection = (state) => state.collections.selected;

export default collectionsSlice.reducer;
