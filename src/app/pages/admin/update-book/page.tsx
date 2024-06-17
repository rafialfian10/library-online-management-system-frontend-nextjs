"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import { updateBook } from "@/redux/features/bookSlice";
import { fetchCategories } from "@/redux/features/categorySlice";

import AuthAdmin from "@/app/components/auth-admin/authAdmin";

import { API } from "@/app/api/api";

import { UserAuth } from "@/types/userAuth";
import { AddBookValues } from "@/types/addBook";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import pdfIcon from "@/assets/img/icon-pdf.png";

export interface UpdateMovieProps {
  modalUpdateBook: boolean;
  setModalUpdateBook: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalUpdateBook: () => void;
  dataBook: any;
  fetchBooks: () => void;
}

function UpdateBook({
  modalUpdateBook,
  setModalUpdateBook,
  closeModalUpdateBook,
  dataBook,
  fetchBooks,
}: UpdateMovieProps) {
  const { data: session, status } = useSession();
  const user: UserAuth | undefined = session?.user;

  const dispatch = useDispatch<AppDispatch>();

  const categories = useAppSelector(
    (state: RootState) => state.categorySlice.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  const errorMessages = {
    title: "Title is required",
    publicationDate: "Publication date is required",
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
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddBookValues>({
    defaultValues: {
      categoryId:
        dataBook?.categories.map((category: any) => category.id) || [],
    },
  });

  useEffect(() => {
    if (dataBook) {
      setValue("title", dataBook?.title);
      if (dataBook?.publicationDate) {
        const date = new Date(dataBook?.publicationDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        setValue("publicationDate", formattedDate);
      }
      // setValue('category', dataBook?.category);
      setValue("isbn", dataBook?.isbn);
      setValue("pages", dataBook?.pages);
      setValue("author", dataBook?.author);
      setValue("description", dataBook?.description);
      setValue("image", dataBook?.image);
      setValue("file", dataBook?.file);
      setValue("qty", dataBook?.qty);
      setValue("selectAll", false);
    }
  }, [dataBook, setValue]);

  const onSubmit: SubmitHandler<AddBookValues> = async (data) => {
    const formData = new FormData();
    formData.append("title", data?.title);
    formData.append("publicationDate", data?.publicationDate);
    formData.append("isbn", data.isbn);
    formData.append("pages", data.pages.toString());
    formData.append("author", data.author);
    formData.append("description", data.description);
    formData.append("image", data.image[0]);
    formData.append("file", data.file[0]);
    formData.append("qty", data.qty.toString());
    const categoryId = data?.categoryId?.map(Number);
    formData.append("categoryId", JSON.stringify(categoryId));

    try {
      const response = await dispatch(
        updateBook({ formData, id: dataBook?.id, session })
      );

      if (response.payload && response.payload.status === 200) {
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
        fetchBooks();
        setModalUpdateBook(false);
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
      toast.error("Book failed updated!", {
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
    console.log("Update book failed");
  };

  const handleDeleteImage = async (e: any) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "question",
        iconColor: "#6B7280",
        background: "#FFFFFF",
        showCancelButton: true,
        customClass: {
          confirmButton: "swal-button-width",
          cancelButton: "swal-button-width",
        },
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        confirmButtonColor: "#6B7280",
        cancelButtonColor: "#CD2E71",
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          const config = {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: "Bearer " + user?.data?.token,
            },
          };
          const response = await API.delete(
            `/book/${dataBook?.id}/image`,
            config
          );
          if (response.status === 200) {
            toast.success("Image successfully deleted!", {
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
            fetchBooks();
            setModalUpdateBook(false);
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Image failed to delete!", {
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

  const handleDeleteFile = async (e: any) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "question",
        iconColor: "#6B7280",
        background: "#FFFFFF",
        showCancelButton: true,
        customClass: {
          confirmButton: "swal-button-width",
          cancelButton: "swal-button-width",
        },
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        confirmButtonColor: "#6B7280",
        cancelButtonColor: "#CD2E71",
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          const config = {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: "Bearer " + user?.data?.token,
            },
          };
          const res = await API.delete(`/book/${dataBook?.id}/file`, config);
          if (res.status === 200) {
            toast.success("File successfully deleted!", {
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
            fetchBooks();
            setModalUpdateBook(false);
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("File failed to delete!", {
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

  return (
    <section>
      <Transition appear show={modalUpdateBook} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeModalUpdateBook}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md md:max-w-4xl mt-20 mb-10 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    encType="multipart/form-data"
                  >
                    <p className="w-full font-bold text-2xl text-gray-500">
                      Update Book
                    </p>
                    <div className="border-b border-gray-900/10 pb-8">
                      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="title"
                            className="text-bold text-gray-500"
                          >
                            Title
                          </label>
                          <div className="relative mt-2 flex items-center">
                            <input
                              type="text"
                              id="title"
                              autoComplete="off"
                              className="block w-full text-sm bg-white rounded-md p-1.5 shadow-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                              {...register("title", {
                                required: errorMessages.title,
                              })}
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
                            htmlFor="publication-data"
                            className="text-bold text-gray-500"
                          >
                            Publication Date
                          </label>
                          <div className="relative mt-2 flex items-center">
                            <input
                              type="date"
                              id="publication-data"
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
                          <label
                            htmlFor="category"
                            className="text-bold text-gray-500"
                          >
                            Category
                          </label>
                          <div className="relative mt-2 flex items-start">
                            <div className="mr-5 flex flex-col flex-wrap h-28">
                              {categories?.map((category: any) => {
                                const isChecked = dataBook?.categories.some(
                                  (idCategory: { id: number }) =>
                                    idCategory.id == category.id
                                );
                                return (
                                  <div
                                    className="flex items-center mb-3"
                                    key={category.id}
                                  >
                                    <input
                                      type="checkbox"
                                      id={category.category}
                                      className="w-5 h-5 bg-[#535252] text-[#CD2E71] focus:ring-[#CD2E71] rounded"
                                      value={category.id}
                                      defaultChecked={isChecked}
                                      {...register("categoryId", {
                                        required: {
                                          value: true,
                                          message: errorMessages.categoryId,
                                        },
                                      })}
                                    />
                                    <label
                                      htmlFor={category.category}
                                      className="ml-2 mr-5 text-gray-500"
                                    >
                                      {category.category}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {errors.categoryId ? (
                            <p className="text-red-500">
                              {errors.categoryId.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="col-span-full">
                          <label
                            htmlFor="isbn"
                            className="text-bold text-gray-500"
                          >
                            ISBN
                          </label>
                          <div className="relative mt-2 flex items-center">
                            <input
                              type="text"
                              id="isbn"
                              autoComplete="off"
                              className="block w-full text-sm bg-white rounded-md p-1.5 shadow-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                              {...register("isbn", {
                                required: errorMessages.isbn,
                              })}
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
                          <label
                            htmlFor="pages"
                            className="text-bold text-gray-500"
                          >
                            pages
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
                          <label
                            htmlFor="author"
                            className="text-bold text-gray-500"
                          >
                            Author
                          </label>
                          <div className="relative mt-2 flex items-center">
                            <input
                              type="text"
                              id="author"
                              autoComplete="off"
                              className="block w-full text-sm bg-white rounded-md p-1.5 shadow-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                              {...register("author", {
                                required: errorMessages.author,
                              })}
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
                        {dataBook?.image &&
                        dataBook?.image !==
                          "http://localhost:5000/uploads//book/image/" ? (
                          <div className="col-span-full">
                            <label
                              htmlFor="image"
                              className="text-bold text-gray-500"
                            >
                              Image
                            </label>
                            <div className="relative mt-2 flex justify-start items-end max-md:flex-col max-md:items-start">
                              <Image
                                src={dataBook?.image}
                                alt={dataBook?.title}
                                width={300}
                                height={300}
                                className="w-1/2 max-md:w-full mb-2 rounded-md shadow shadow-gray-500"
                              />
                              <button
                                type="button"
                                className="w-30 ml-5 max-md:ml-0 flex justify-center items-center rounded-lg shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white px-2 py-1"
                                onClick={handleDeleteImage}
                              >
                                <span className="w-5 h-5 mr-1 flex justify-center items-center text-[#D2D2D2] font-bold bg-red-500 rounded-full shadow-lg p-2">
                                  X
                                </span>{" "}
                                Delete Image
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="col-span-full">
                            <label
                              htmlFor="image"
                              className="text-bold text-gray-500"
                            >
                              Image
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
                                className="mt-1 text-xs text-gray-500 dark:text-gray-500"
                                id="file_input_help"
                              >
                                (PNG, JPG, JPEG, WEBP, GIF)
                              </p>
                            </div>
                          </div>
                        )}
                        {dataBook?.file &&
                        dataBook?.file !==
                          "http://localhost:5000/uploads/book/file/" ? (
                          <div className="col-span-full">
                            <label
                              htmlFor="file"
                              className="text-bold text-gray-500"
                            >
                              File
                            </label>
                            <div className="relative mt-2 flex justify-start items-end max-md:flex-col max-md:items-start">
                              <div className="flex flex-col justify-center items-center">
                                <Image
                                  src={pdfIcon}
                                  alt="icon-pdf"
                                  className="mr-2"
                                  width={70}
                                  height={70}
                                />
                                <span className="text-gray-700">
                                  {dataBook?.title} 
                                </span>
                              </div>
                              <button
                                type="button"
                                className="w-30 ml-5 max-md:ml-0 flex justify-center items-center rounded-lg shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white px-2 py-1"
                                onClick={handleDeleteFile}
                              >
                                <span className="w-5 h-5 mr-1 flex justify-center items-center text-[#D2D2D2] font-bold bg-red-500 rounded-full shadow-lg p-2">
                                  X
                                </span>{" "}
                                Delete File
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="col-span-full">
                            <label
                              htmlFor="file"
                              className="text-bold text-gray-500"
                            >
                              File
                            </label>
                            <div className="relative mt-2 items-center">
                              <input
                                type="file"
                                id="file"
                                className="w-full m-0 bg-white flex-auto rounded-md px-3 py-[0.32rem] transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:border-inherit file:rounded-md file:px-3 file:py-[0.32rem] file:transition file:duration-150 file:[margin-inline-end:0.75rem] focus:outline-none dark:file:bg-blue-500 dark:file:text-white text-gray-500"
                                {...register("file", {
                                  required: errorMessages.file,
                                })}
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
                                className="mt-1 text-xs text-gray-500 dark:text-gray-500"
                                id="file_input_help"
                              >
                                (PDF)
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="col-span-full">
                          <label
                            htmlFor="qty"
                            className="text-bold text-gray-500"
                          >
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
                        className="w-200 px-3 py-1.5 rounded-md sshadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white"
                      >
                        Update Book
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}

export default AuthAdmin(UpdateBook);

async function getAllCategories() {
  const response = await fetch("http://localhost:5000/api/v1/categories", {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return await response.json();
}
