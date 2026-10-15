import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import collectionsReducer from "./slices/collectionsSlice";
import bannersReducer from "./slices/bannersSlice";
import enquiryReducer from "./slices/enquirySlice";

// A factory (not a singleton) so each server request gets its own store in Next.js
export const makeStore = () =>
  configureStore({
    reducer: {
      products: productsReducer,
      collections: collectionsReducer,
      banners: bannersReducer,
      enquiry: enquiryReducer,
    },
  });
