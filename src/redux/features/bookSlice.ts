import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { API } from "@/app/api/api";

import { UserAuth } from "@/types/userAuth";
import { BookValues } from "@/types/book";

export const fetchBooks = createAsyncThunk(
  "books/fetch",
  async (
    { page, perPage }: { page: number; perPage: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.get(`/books?page=${page}&per-page=${perPage}`);

      if (response.status !== 200) {
        throw new Error("Failed to books");
      }

      const result = await response.data;
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchBook = createAsyncThunk(
  "book/fetch",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/book/${id}`);

      if (response.status !== 200) {
        throw new Error("Failed to book");
      }

      const result = await response.data.data;
      return result;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch book"
      );
    }
  }
);

export const createBook = createAsyncThunk(
  "book/create-book",
  async (
    { formData, session }: { formData: any; session: any },
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
      const response = await API.post("/book", formData, config);
      console.log("response", response);

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
        (error as Error).message || "Failed to create book"
      );
    }
  }
);

export const updateBook = createAsyncThunk(
  "book/update-book",
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
      const response = await API.patch(`/book/${id}`, formData, config);

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
        (error as Error).message || "Failed to update book"
      );
    }
  }
);

export const deleteBook = createAsyncThunk(
  "book/delete-book",
  async (
    { id, session }: { id: number; session: any },
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
      const response = await API.delete(`/book/${id}`, config);

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
        (error as Error).message || "Failed to delete book"
      );
    }
  }
);

type bookState = {
  books: {
    data: BookValues[];
    currentPage: number;
    totalData: number;
    totalPage: number;
  };
  book: BookValues;
  loading: boolean;
  error: null | any;
};

const initialStateBook: bookState = {
  books: {
    data: [],
    currentPage: 1,
    totalData: 0,
    totalPage: 0,
  },
  book: {} as BookValues,
  loading: false,
  error: null,
};

const bookSlices = createSlice({
  name: "bookSlice",
  initialState: initialStateBook,
  reducers: {
    Books: (state, action: PayloadAction<BookValues[]>) => {
      state.books.data = action.payload;
    },
    Book: (state, action: PayloadAction<BookValues>) => {
      state.book = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBooks.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchBooks.fulfilled,
      (
        state,
        action: PayloadAction<{
          data: BookValues[];
          currentPage: number;
          totalData: number;
          totalPage: number;
        }>
      ) => {
        state.loading = false;
        state.books = action.payload;
      }
    );
    builder.addCase(fetchBooks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchBook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchBook.fulfilled,
      (state, action: PayloadAction<BookValues>) => {
        state.loading = false;
        state.book = action.payload;
      }
    );
    builder.addCase(fetchBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(createBook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createBook.fulfilled,
      (state, action: PayloadAction<BookValues>) => {
        state.loading = false;
        state.books.data.push(action.payload);
      }
    );
    builder.addCase(createBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateBook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateBook.fulfilled,
      (state, action: PayloadAction<BookValues>) => {
        state.loading = false;
        state.books.data = state.books.data.map((element: any) =>
          element.id === action.payload.id ? action.payload : element
        );
      }
    );
    builder.addCase(updateBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(deleteBook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteBook.fulfilled,
      (state, action: PayloadAction<BookValues>) => {
        state.loading = false;
        const { id } = action.payload;
        if (id) {
          state.books.data = state.books.data.filter((element: any) => element.id !== id);
        }
      }
    );
    builder.addCase(deleteBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { Books, Book } = bookSlices.actions;
export default bookSlices.reducer;
