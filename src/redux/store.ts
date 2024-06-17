import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";

import userSlice from "./features/userSlice";
import categorySlice from "./features/categorySlice";
import bookSlice from "./features/bookSlice";
import transactionSlice from "./features/transactionSlice";
import fineSlice from "./features/fineSlice";

export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    categorySlice: categorySlice,
    bookSlice: bookSlice,
    transactionSlice: transactionSlice,
    fineSlice: fineSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
