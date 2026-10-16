import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./slices/categoriesSlice";
import productsReducer from "./slices/productsSlice";
import collectionsReducer from "./slices/collectionsSlice";
import bannersReducer from "./slices/bannersSlice";
import enquiryReducer from "./slices/enquirySlice";

// A factory (not a singleton) so each server request gets its own store in Next.js
export const makeStore = () =>
  configureStore({
    reducer: {
      categories: categoriesReducer,
      products: productsReducer,
      collections: collectionsReducer,
      banners: bannersReducer,
      enquiry: enquiryReducer,
    },
  });
