"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import { fetchBooks, createBook } from "@/redux/features/bookSlice";
import { fetchCategories } from "@/redux/features/categorySlice";

import AuthAdmin from "@/app/components/auth-admin/authAdmin";
import Navbar from "@/app/components/navbar/navbar";
import { AddBookValues } from "@/types/addBook";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddBook() {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const books = useAppSelector(
    (state: RootState) => state.bookSlice.books
  );

  const categories = useAppSelector(
    (state: RootState) => state.categorySlice.categories
  );

  useEffect(() => {
    dispatch(fetchBooks({page: 1, perPage: books?.data?.length}));
    dispatch(fetchCategories({page: 1, perPage: categories?.data?.length}));
  }, [dispatch, session, status]);

  const router = useRouter();

  const errorMessages = {
    title: "Title is required",
    publicationDate: "Release date is required",
    isbn: "ISBN is required",
    pages: "Pages is required",
    author: "Author is required",
    description: "Description is required",
    image: "Image is required",
    file: "File is required",
    qty: "Qty is required",
    categoryId: "Category is required",
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddBookValues>({
    defaultValues: {
      title: "",
      publicationDate: "",
      pages: 0,
      isbn: "",
      description: "",
      image: undefined,
      file: undefined,
      qty: 0,
      categoryId: [],
      selectAll: false,
    },
  });

  const onSubmit: SubmitHandler<AddBookValues> = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("publicationDate", data.publicationDate);
    const categoryId = data.categoryId.map(Number);
    formData.append("isbn", data.isbn);
    formData.append("pages", data.pages.toString());
    formData.append("author", data.author);
    formData.append("description", data.description);
    // formData.append("image", data.image[0]);
    // formData.append("file", data.file[0]);
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }
    formData.append("qty", data.qty.toString());
    formData.append("categoryId", JSON.stringify(categoryId));

    try {
      const response = await dispatch(createBook({ formData, session }));

      if (response.payload && response.payload.status === 201) {
        toast.success(response.payload.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: { marginTop: "65px" },
        });
        dispatch(fetchBooks({page: 1, perPage: books?.data?.length}));
        router.push("/pages/admin/list-book");
        reset();
      } else if (response.payload && response.payload.status === 401) {
        toast.error(response.payload.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: { marginTop: "65px" },
        });
      }
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Book failed added!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: { marginTop: "65px" },
      });
    }
  };

  const onError = () => {
    console.log("Add book failed");
  };

  const selectedCategoryId = watch("categoryId");
  const handleChangeSelectAll = (checked: any) => {
    setValue("selectAll", checked);
    const categoryIds = categories?.data?.map((category: any) => category.id);
    setValue("categoryId", checked ? categoryIds : []);
  };

  const handleChangeCategory = (categoryId: number) => {
    const updatedSelectedCategoryId = selectedCategoryId.includes(categoryId)
      ? selectedCategoryId.filter((id) => id !== categoryId)
      : [...selectedCategoryId, categoryId];
    setValue("categoryId", updatedSelectedCategoryId);
  };

  return (
    <>
      <Navbar />
      <section className="w-full my-20 px-32 max-md:px-5">
        <form encType="multipart/form-data">
          <p className="w-full font-bold text-2xl text-gray-500">Add Book</p>
          <div className="border-b border-gray-900/10 pb-8">
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="col-span-full">
                <label htmlFor="title" className="text-bold text-gray-500">
                  Title
                </label>
                <div className="relative mt-2 flex items-center">
                  <input
                    type="text"
                    id="title"
                    autoComplete="off"
                    className="block w-full text-sm bg-white rounded-md p-1.5 shadow-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("title", { required: errorMessages.title })}
                  />
                </div>
                {errors.title ? (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.title.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="publication-date"
                  className="text-bold text-gray-500"
                >
                  Publication Date
                </label>
                <div className="relative mt-2 flex items-center">
                  <input
                    type="date"
                    id="publication-date"
                    autoComplete="off"
                    className="block w-full text-sm bg-white rounded-md p-1.5 shadow-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("publicationDate", {
                      required: errorMessages.publicationDate,
                    })}
                  />
                </div>
                {errors.publicationDate ? (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.publicationDate.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="col-span-full">
                <label htmlFor="category" className="text-bold text-gray-500">
                  Category
                </label>
                <div className="relative mt-2 flex items-start">
                  <div className="w-full h-fit flex flex-wrap">
                    {categories?.data?.map((category: any) => {
                      return (
                        <div
                          className="w-1/6 max-sm:w-1/3 mb-3 flex items-center"
                          key={category.id}
                        >
                          <input
                            type="checkbox"
                            id={category.category}
                            className="w-5 h-5 bg-white text-[#CD2E71] focus:ring-[#CD2E71] rounded"
                            value={category.id}
                            {...register("categoryId", {
                              required: {
                                value: true,
                                message: errorMessages.categoryId,
                              },
                            })}
                            checked={selectedCategoryId.includes(category.id)}
                            onChange={() => handleChangeCategory(category.id)}
                          />
                          <label
                            htmlFor={category.category}
                            className="ml-2 text-gray-500"
                          >
                            {category.category}
                          </label>
                        </div>
                      );
                    })}
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="select-all"
                        className="w-5 h-5 bg-white text-[#CD2E71] focus:ring-[#CD2E71] rounded"
                        {...register("selectAll")}
                        onChange={(e) =>
                          handleChangeSelectAll(e.target.checked)
                        }
                      />
                      <label
                        htmlFor="select-all"
                        className="ml-2 mr-5 text-gray-500"
                      >
                        Select all
                      </label>
                    </div>
                  </div>
                </div>
                {selectedCategoryId.length === 0 && errors.categoryId ? (
                  <p className="text-red-500 text-sm">
                    {errors.categoryId.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="col-span-full">
                <label htmlFor="isbn" className="text-bold text-gray-500">
                  ISBN
                </label>
                <div className="relative mt-2 flex items-center">
                  <input
                    type="text"
                    id="isbn"
                    autoComplete="off"
                    className="block w-full text-sm bg-white rounded-md p-1.5 shadow-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("isbn", { required: errorMessages.isbn })}
                  />
                </div>
                {errors.isbn ? (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.isbn.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="col-span-full">
                <label htmlFor="pages" className="text-bold text-gray-500">
                  Pages
                </label>
                <div className="relative mt-2 flex items-center">
                  <input
                    type="text"
                    id="pages"
                    autoComplete="off"
                    className="block w-full text-sm bg-white rounded-md p-1.5 shadow-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("pages", {
                      required: errorMessages.pages,
                      validate: (value) => {
                        if (isNaN(value)) {
                          return "Pages must be a valid number";
                        }
                        if (value < 1) {
                          return "Pages must be greater than 1";
                        }
                        return true;
                      },
                    })}
                  />
                </div>
                {errors.pages ? (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.pages.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="col-span-full">
                <label htmlFor="isbn" className="text-bold text-gray-500">
                  Author
                </label>
                <div className="relative mt-2 flex items-center">
                  <input
                    type="text"
                    id="author"
                    autoComplete="off"
                    className="block w-full text-sm bg-white rounded-md p-1.5 shadow-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("author", { required: errorMessages.author })}
                  />
                </div>
                {errors.author ? (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.author.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="text-bold text-gray-500"
                >
                  Description
                </label>
                <div className="relative mt-2 flex items-center">
                  <textarea
                    id="description"
                    rows={3}
                    className="block w-full text-sm bg-white rounded-md p-1.5 shadow-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    defaultValue={""}
                    {...register("description", {
                      required: errorMessages.description,
                    })}
                  />
                </div>
                {errors.description ? (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="col-span-full">
                <label htmlFor="image" className="text-bold text-gray-500">
                  Upload Image
                </label>
                <div className="relative mt-2 items-center">
                  <input
                    type="file"
                    id="image"
                    className="w-full m-0 bg-white flex-auto rounded-md px-3 py-[0.32rem] transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:border-inherit file:rounded-md file:px-3 file:py-[0.32rem] file:transition file:duration-150 file:[margin-inline-end:0.75rem] focus:outline-none dark:file:bg-blue-500 dark:file:text-white text-gray-500"
                    {...register("image", {
                      required: errorMessages.image,
                    })}
                    accept=".jpg,.jpeg,.png,.webp,.gif"
                  />
                  {errors.image ? (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.image.message}
                    </p>
                  ) : (
                    ""
                  )}
                  <p
                    className="mt-1 text-sm text-gray-500 dark:text-gray-500"
                    id="file_input_help"
                  >
                    PNG, JPG, JPEG, WEBP, GIF.
                  </p>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="file" className="text-bold text-gray-500">
                  Upload File
                </label>
                <div className="relative mt-2 items-center">
                  <input
                    type="file"
                    id="file"
                    className="w-full m-0 bg-white flex-auto rounded-md px-3 py-[0.32rem] transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:border-inherit file:rounded-md file:px-3 file:py-[0.32rem] file:transition file:duration-150 file:[margin-inline-end:0.75rem] focus:outline-none dark:file:bg-blue-500 dark:file:text-white text-gray-500"
                    {...register("file", { required: errorMessages.file })}
                    accept="application/pdf"
                  />
                  {errors.file ? (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.file.message}
                    </p>
                  ) : (
                    ""
                  )}
                  <p
                    className="mt-1 text-sm text-gray-500 dark:text-gray-500"
                    id="file_input_help"
                  >
                    PDF
                  </p>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="pages" className="text-bold text-gray-500">
                  Qty
                </label>
                <div className="relative mt-2 flex items-center">
                  <input
                    type="text"
                    id="qty"
                    autoComplete="off"
                    className="block w-full text-sm bg-white rounded-md p-1.5 shadow-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("qty", {
                      required: errorMessages.qty,
                      validate: (value) => {
                        if (isNaN(value)) {
                          return "Qty must be a valid number";
                        }
                        if (value < 1) {
                          return "Qty must be greater than 1";
                        }
                        return true;
                      },
                    })}
                  />
                </div>
                {errors.qty ? (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.qty.message}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="w-200 px-3 py-1.5 rounded-md shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white"
              onClick={(e) => handleSubmit(onSubmit, onError)(e)}
            >
              Add Book
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default AuthAdmin(AddBook);
