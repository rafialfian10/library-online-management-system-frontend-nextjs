import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { API } from "@/app/api/api";

import { UserAuth } from "@/types/userAuth";
import { TransactionValues } from "@/types/transaction";

export const fetchTransactionByUser = createAsyncThunk(
  "transactions/fetch-transactions-by-user",
  async (
    { session, status }: { session: any; status: any },
    { rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    if (status === "authenticated" && userAuth?.data?.token) {
      const config = {
        headers: {
          "Content-type": "apllication/json",
          Authorization: "Bearer " + userAuth?.data?.token,
        },
      };

      try {
        const response = await API.get(`/transactions-by-user`, config);
        if (response.status !== 200) {
          throw new Error("Failed to fetch transactions");
        }

        const result = await response.data.data;
        return result;
      } catch (error) {
        return rejectWithValue(
          (error as Error).message || "Failed to fetch transactions"
        );
      }
    }
  }
);

export const fetchTransactionByAdmin = createAsyncThunk(
  "transactions/fetch-transactions-by-admin",
  async (
    { session, status }: { session: any; status: any },
    { rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    if (status === "authenticated" && userAuth?.data?.token) {
      const config = {
        headers: {
          "Content-type": "apllication/json",
          Authorization: "Bearer " + userAuth?.data?.token,
        },
      };

      try {
        const response = await API.get(`/transactions-by-admin`, config);    
        if (response.status !== 200) {
          throw new Error("Failed to fetch transactions");
        }
        const result = await response.data.data;
        
        return result;
      } catch (error) {
        return rejectWithValue(
          (error as Error).message || "Failed to fetch transactions"
        );
      }
    }
  }
);

export const fetchTransaction = createAsyncThunk(
  "transaction/fetch-transaction",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/transaction/${id}`);

      if (response.status !== 200) {
        throw new Error("Failed to transaction");
      }

      const result = await response.data.data;
      return result;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch transaction"
      );
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transaction/create-transaction",
  async (
    { formData, session }: { formData: any; session: any },
    { rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + userAuth?.data?.token,
      },
    };

    try {
      const response = await API.post("/transaction", formData, config);
      
      if (response.status === 201) {
        const result = await response.data;
        return result;
      }
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.data.status,
          message: error.response.data.message,
        });
      }

      return rejectWithValue(
        (error as Error).message || "Failed to create transaction"
      );
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transaction/update-transaction",
  async (
    { formData, id, session }: { formData: any; id: number; session: any },
    { rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + userAuth?.data?.token,
      },
    };

    try {
      const response = await API.patch(`/transaction/${id}`, formData, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.data.status,
          message: error.response.data.message,
        });
      }

      return rejectWithValue(
        (error as Error).message || "Failed to update transaction"
      );
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transaction/delete-transaction",
  async (
    { id, session }: { id: number; session: any },
    { rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + userAuth?.data?.token,
      },
    };

    try {
      const response = await API.delete(`/transaction/${id}`, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.data.status,
          message: error.response.data.message,
        });
      }

      return rejectWithValue(
        (error as Error).message || "Failed to delete transaction"
      );
    }
  }
);

type transactionState = {
  transactions: TransactionValues[];
  transaction: TransactionValues;
  loading: boolean;
  error: null | any;
};

const initialStateTransaction: transactionState = {
  transactions: [] as TransactionValues[],
  transaction: {} as TransactionValues,
  loading: false,
  error: null,
};

const transactionSlices = createSlice({
  name: "transactionSlice",
  initialState: initialStateTransaction,
  reducers: {
    Transactions: (state, action: PayloadAction<TransactionValues[]>) => {
      state.transactions = action.payload;
    },
    Transaction: (state, action: PayloadAction<TransactionValues>) => {
      state.transaction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTransactionByUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchTransactionByUser.fulfilled,
      (state, action: PayloadAction<TransactionValues[]>) => {
        state.loading = false;
        state.transactions = action.payload;
      }
    );
    builder.addCase(fetchTransactionByUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchTransactionByAdmin.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchTransactionByAdmin.fulfilled,
      (state, action: PayloadAction<TransactionValues[]>) => {
        state.loading = false;
        state.transactions = action.payload;
      }
    );
    builder.addCase(fetchTransactionByAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchTransaction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchTransaction.fulfilled,
      (state, action: PayloadAction<TransactionValues>) => {
        state.loading = false;
        state.transaction = action.payload;
      }
    );
    builder.addCase(fetchTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(createTransaction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createTransaction.fulfilled,
      (state, action: PayloadAction<TransactionValues>) => {
        state.loading = false;
        state.transactions.push(action.payload);
      }
    );
    builder.addCase(createTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateTransaction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateTransaction.fulfilled,
      (state, action: PayloadAction<TransactionValues>) => {
        state.loading = false;
        state.transactions = state.transactions.map((element: any) =>
          element.id === action.payload.id ? action.payload : element
        );
      }
    );
    builder.addCase(updateTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(deleteTransaction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteTransaction.fulfilled,
      (state, action: PayloadAction<TransactionValues>) => {
        state.loading = false;
        const { id } = action.payload;
        if (id) {
          state.transactions = state.transactions.filter((element: any) => element.id !== id);
        }
      }
    );
    builder.addCase(deleteTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { Transactions, Transaction } = transactionSlices.actions;
export default transactionSlices.reducer;
