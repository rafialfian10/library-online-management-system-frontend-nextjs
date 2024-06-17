import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { API } from "@/app/api/api";

import { UserAuth } from "@/types/userAuth";
import { CheckAuthValues } from "@/types/checkAuth";
import { RegisterValues } from "@/types/register";
import { VerifyOtpValues } from "@/types/verifyOtp";
import { ResendOtpValues } from "@/types/resendOtp";

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (
    { session, status }: { session: any; status: any },
    { rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    if (status === "authenticated" && userAuth?.data?.token) {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + userAuth?.data?.token,
        },
      };

      try {
        const response = await API.get(`/users`, config);
        if (response.status !== 200) {
          throw new Error("Failed to fetch users");
        }

        const result = await response.data.data;
        return result;
      } catch (error) {
        return rejectWithValue(
          (error as Error).message || "Failed to fetch users"
        );
      }
    }
  }
);

export const fetchUserAuth = createAsyncThunk(
  "user/fetch-user-auth",
  async (
    { session, status }: { session: any; status: any },
    { rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    if (status === "authenticated" && userAuth?.data?.token) {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + userAuth?.data?.token,
        },
      };

      try {
        const response = await API.get(`/check-auth`, config);
        if (response.status !== 200) {
          throw new Error("Failed to fetch user auth");
        }

        const result = await response.data.data;
        return result;
      } catch (error) {
        return rejectWithValue(
          (error as Error).message || "Failed to fetch user auth"
        );
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async ({ formData }: { formData: any }, { rejectWithValue }) => {
    try {
      const response = await API.post("/register", formData);
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

      return rejectWithValue((error as Error).message || "Failed to register");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "user/verify-otp",
  async ({ formData }: { formData: any }, { rejectWithValue }) => {
    try {
      const response = await API.post("/verify-otp", formData);
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
        (error as Error).message || "Failed to verify otp"
      );
    }
  }
);

export const resendOtp = createAsyncThunk(
  "user/resend-otp",
  async ({ formData }: { formData: any }, { rejectWithValue }) => {
    try {
      const response = await API.post("/resend-otp", formData);
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
        (error as Error).message || "Failed to resend otp"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update-user",
  async (
    { formData, id, session }: { formData: any; id: number; session: any },
    { rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: "Bearer " + userAuth?.data?.token,
      },
    };

    try {
      const response = await API.patch(`/user/${id}`, formData, config);

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
        (error as Error).message || "Failed to update user"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete-user",
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
      const response = await API.delete(`/user/${id}`, config);

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
        (error as Error).message || "Failed to delete user"
      );
    }
  }
);

type userState = {
  users: CheckAuthValues[];
  user: CheckAuthValues;
  register: RegisterValues;
  verifyOtp: VerifyOtpValues;
  resendOtp: ResendOtpValues;
  loading: boolean;
  error: null | any;
};

const initialStateUser: userState = {
  users: [] as CheckAuthValues[],
  user: {} as CheckAuthValues,
  register: {} as RegisterValues,
  verifyOtp: {} as VerifyOtpValues,
  resendOtp: {} as ResendOtpValues,
  loading: false,
  error: null,
};

const userSlices = createSlice({
  name: "userlice",
  initialState: initialStateUser,
  reducers: {
    Register: (state, action: PayloadAction<RegisterValues>) => {
      state.register = action.payload;
    },
    VerifyOtp: (state, action: PayloadAction<VerifyOtpValues>) => {
      state.verifyOtp = action.payload;
    },
    ResendOtp: (state, action: PayloadAction<ResendOtpValues>) => {
      state.resendOtp = action.payload;
    },
    Users: (state, action: PayloadAction<CheckAuthValues[]>) => {
      state.users = action.payload;
    },
    User: (state, action: PayloadAction<CheckAuthValues>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      registerUser.fulfilled,
      (state, action: PayloadAction<RegisterValues>) => {
        state.loading = false;
        state.register = action.payload;
      }
    );
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(verifyOtp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      verifyOtp.fulfilled,
      (state, action: PayloadAction<VerifyOtpValues>) => {
        state.loading = false;
        state.verifyOtp = action.payload;
      }
    );
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(resendOtp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      resendOtp.fulfilled,
      (state, action: PayloadAction<ResendOtpValues>) => {
        state.loading = false;
        state.resendOtp = action.payload;
      }
    );
    builder.addCase(resendOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(fetchUsers.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<CheckAuthValues[]>) => {
        state.loading = false;
        state.users = action.payload;
      }
    );
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchUserAuth.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchUserAuth.fulfilled,
      (state, action: PayloadAction<CheckAuthValues>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(fetchUserAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<CheckAuthValues>) => {
        state.loading = false;
        state.user =
          state.user.id === action.payload.id ? action.payload : state.user;
      }
    );
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteUser.fulfilled,
      (state, action: PayloadAction<CheckAuthValues>) => {
        state.loading = false;
        const { id } = action.payload;
        if (id) {
          state.user = {} as CheckAuthValues;
        }
      }
    );
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { Register, VerifyOtp, ResendOtp, Users, User } =
  userSlices.actions;
export default userSlices.reducer;
