"use client";

import { Provider } from "react-redux";
import { makeStore } from "./index";

// Created at module scope, not during render: Redux calls Math.random() while
// building the store, which Cache Components rejects inside a prerender.
// Data is only fetched client-side (thunks dispatched in effects), so the
// server copy always stays at initial state and is safe to share.
const store = makeStore();

export default function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
