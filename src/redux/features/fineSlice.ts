import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { API } from "@/app/api/api";

import { UserAuth } from "@/types/userAuth";
import { FineValues } from "@/types/fine";

export const fetchFineByUser = createAsyncThunk(
  "fines/fetch-fines-by-user",
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
        const response = await API.get(`/fines-by-user`, config);
        if (response.status !== 200) {
          throw new Error("Failed to fetch fines");
        }

        const result = await response.data.data;
        return result;
      } catch (error) {
        return rejectWithValue(
          (error as Error).message || "Failed to fetch fines"
        );
      }
    }
  }
);

export const fetchFineByAdmin = createAsyncThunk(
  "fines/fetch-fines-by-admin",
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
        const response = await API.get(`/fines-by-admin`, config);    
        if (response.status !== 200) {
          throw new Error("Failed to fetch fines");
        }
        const result = await response.data.data;
        
        return result;
      } catch (error) {
        return rejectWithValue(
          (error as Error).message || "Failed to fetch fines"
        );
      }
    }
  }
);

export const fetchFine = createAsyncThunk(
  "fine/fetch-fine",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/fine/${id}`);

      if (response.status !== 200) {
        throw new Error("Failed to fine");
      }

      const result = await response.data.data;
      return result;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch fine"
      );
    }
  }
);

export const createFine = createAsyncThunk(
  "fine/create-fine",
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
      const response = await API.post("/fine", formData, config);
      
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
        (error as Error).message || "Failed to create fine"
      );
    }
  }
);

export const updateFine = createAsyncThunk(
  "fine/update-fine",
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
      const response = await API.patch(`/fine/${id}`, formData, config);
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
        (error as Error).message || "Failed to update fine"
      );
    }
  }
);

export const updateFineByAdmin = createAsyncThunk(
  "fine/update-fine-by-admin",
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
      const response = await API.patch(`/fine-status-by-admin/${id}`, formData, config);
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
        (error as Error).message || "Failed to update fine by admin"
      );
    }
  }
);

export const deleteFine = createAsyncThunk(
  "fine/delete-fine",
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
      const response = await API.delete(`/fine/${id}`, config);

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
        (error as Error).message || "Failed to delete fine"
      );
    }
  }
);

type fineState = {
  fines: FineValues[];
  fine: FineValues;
  loading: boolean;
  error: null | any;
};

const initialFine: fineState = {
  fines: [] as FineValues[],
  fine: {} as FineValues,
  loading: false,
  error: null,
};

const fineSlice = createSlice({
  name: "fineSlice",
  initialState: initialFine,
  reducers: {
    Fines: (state, action: PayloadAction<FineValues[]>) => {
      state.fines = action.payload;
    },
    Fine: (state, action: PayloadAction<FineValues>) => {
      state.fine = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFineByUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchFineByUser.fulfilled,
      (state, action: PayloadAction<FineValues[]>) => {
        state.loading = false;
        state.fines = action.payload;
      }
    );
    builder.addCase(fetchFineByUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchFineByAdmin.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchFineByAdmin.fulfilled,
      (state, action: PayloadAction<FineValues[]>) => {
        state.loading = false;
        state.fines = action.payload;
      }
    );
    builder.addCase(fetchFineByAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchFine.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchFine.fulfilled,
      (state, action: PayloadAction<FineValues>) => {
        state.loading = false;
        state.fine = action.payload;
      }
    );
    builder.addCase(fetchFine.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(createFine.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createFine.fulfilled,
      (state, action: PayloadAction<FineValues>) => {
        state.loading = false;
        state.fines.push(action.payload);
      }
    );
    builder.addCase(createFine.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateFine.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateFine.fulfilled,
      (state, action: PayloadAction<FineValues>) => {
        state.loading = false;
        state.fines = state.fines.map((element: any) =>
          element.id === action.payload.id ? action.payload : element
        );
      }
    );
    builder.addCase(updateFine.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateFineByAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateFineByAdmin.fulfilled,
      (state, action: PayloadAction<FineValues>) => {
        state.loading = false;
        state.fines = state.fines.map((element: any) =>
          element.id === action.payload.id ? action.payload : element
        );
      }
    );
    builder.addCase(updateFineByAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(deleteFine.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteFine.fulfilled,
      (state, action: PayloadAction<FineValues>) => {
        state.loading = false;
        const { id } = action.payload;
        if (id) {
          state.fines = state.fines.filter((element: any) => element.id !== id);
        }
      }
    );
    builder.addCase(deleteFine.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { Fines, Fine } = fineSlice.actions;
export default fineSlice.reducer;
