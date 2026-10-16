import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, toRejectValue } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue, signal }) => {
    try {
      const categories = [];
      // The API limits each page to 100 records and the client unwraps `data`.
      for (let page = 1; ; page += 1) {
        const items = await api.get(ENDPOINTS.categories, { params: { page, limit: 100 }, signal });
        if (!Array.isArray(items)) throw new Error("Unable to read categories. Please try again.");
        categories.push(...items);
        if (items.length < 100) break;
      }
      return categories.filter(category => category.isActive !== false);
    } catch (error) {
      return rejectWithValue(toRejectValue(error));
    }
  },
  { condition: (_, { getState }) => !["loading", "succeeded"].includes(getState().categories.status) }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: builder => builder
    .addCase(fetchCategories.pending, state => { state.status = "loading"; state.error = null; })
    .addCase(fetchCategories.fulfilled, (state, action) => { state.status = "succeeded"; state.items = action.payload; })
    .addCase(fetchCategories.rejected, (state, action) => { state.status = "failed"; state.error = action.payload?.message || "Unable to load categories."; }),
});

export default categoriesSlice.reducer;
