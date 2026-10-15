import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, toRejectValue } from "@/lib/apiClient";
import { ENDPOINTS } from "@/config";

// Contact / bulk-quote form submissions
export const submitEnquiry = createAsyncThunk(
  "enquiry/submit",
  async (payload, { rejectWithValue }) => {
    try {
      return await api.post(ENDPOINTS.enquiries, payload);
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  }
);

const initialState = {
  status: "idle", // idle | submitting | succeeded | failed
  error: null,
  lastSubmission: null,
};

const enquirySlice = createSlice({
  name: "enquiry",
  initialState,
  reducers: {
    resetEnquiry: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEnquiry.pending, (state) => {
        state.status = "submitting";
        state.error = null;
      })
      .addCase(submitEnquiry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lastSubmission = action.payload;
      })
      .addCase(submitEnquiry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? action.error.message;
      });
  },
});

export const { resetEnquiry } = enquirySlice.actions;

export const selectEnquiryStatus = (state) => state.enquiry.status;
export const selectEnquiryError = (state) => state.enquiry.error;

export default enquirySlice.reducer;
