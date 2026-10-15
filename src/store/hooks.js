"use client";

import { useDispatch, useSelector, useStore } from "react-redux";

// Use these throughout the app instead of the plain react-redux hooks
export const useAppDispatch = useDispatch.withTypes();
export const useAppSelector = useSelector.withTypes();
export const useAppStore = useStore.withTypes();
