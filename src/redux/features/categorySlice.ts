import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { API } from "@/app/api/api";

import { UserAuth } from "@/types/userAuth";
import { CategoryValues } from "@/types/category";

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async (
    { page, perPage }: { page: number; perPage: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.get(
        `/categories?page=${page}&per-page=${perPage}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch categories");
      }
      const result = await response.data;
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCategory = createAsyncThunk(
  "category/fetch",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/category/${id}`);

      if (response.status !== 200) {
        throw new Error("Failed to category");
      }

      const result = await response.data.data;
      return result;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch category"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/create-category",
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
      const response = await API.post("/category", formData, config);
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
        (error as Error).message || "Failed to create category"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update-category",
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
      const response = await API.patch(`/category/${id}`, formData, config);

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
        (error as Error).message || "Failed to update category"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete-category",
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
      const response = await API.delete(`/category/${id}`, config);

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
        (error as Error).message || "Failed to delete category"
      );
    }
  }
);

type categoryState = {
  categories: {
    data: CategoryValues[];
    currentPage: number;
    totalData: number;
    totalPage: number;
  };
  category: CategoryValues;
  loading: boolean;
  error: null | any;
};

const initialStateCategory: categoryState = {
  categories: {
    data: [],
    currentPage: 1,
    totalData: 0,
    totalPage: 0,
  },
  category: {} as CategoryValues,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categorySlice",
  initialState: initialStateCategory,
  reducers: {
    Categories: (state, action: PayloadAction<CategoryValues[]>) => {
      state.categories.data = action.payload;
    },
    Category: (state, action: PayloadAction<CategoryValues>) => {
      state.category = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchCategories.fulfilled,
      (
        state,
        action: PayloadAction<{
          data: CategoryValues[];
          currentPage: number;
          totalData: number;
          totalPage: number;
        }>
      ) => {
        state.loading = false;
        state.categories = action.payload;
      }
    );
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchCategory.fulfilled,
      (state, action: PayloadAction<CategoryValues>) => {
        state.loading = false;
        state.category = action.payload;
      }
    );
    builder.addCase(fetchCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(createCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createCategory.fulfilled,
      (state, action: PayloadAction<CategoryValues>) => {
        state.loading = false;
        state.categories.data.push(action.payload);
      }
    );
    builder.addCase(createCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateCategory.fulfilled,
      (state, action: PayloadAction<CategoryValues>) => {
        state.loading = false;
        state.categories.data = state.categories.data.map((element: any) =>
          element.id === action.payload.id ? action.payload : element
        );
      }
    );
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteCategory.fulfilled,
      (state, action: PayloadAction<CategoryValues>) => {
        state.loading = false;
        const { id } = action.payload;
        if (id) {
          state.categories.data = state.categories.data.filter(
            (element: any) => element.id !== id
          );
        }
      }
    );
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { Categories, Category } = categorySlice.actions;
export default categorySlice.reducer;
