import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { extendedApiSlice } from "./extendedApiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [extendedApiSlice.reducerPath]: extendedApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      extendedApiSlice.middleware,
    ),
});

export default store;
