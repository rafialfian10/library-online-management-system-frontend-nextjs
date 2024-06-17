"use client";

import { useSession } from "next-auth/react";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createCategory } from "@/redux/features/categorySlice";

import AuthAdmin from "@/app/components/auth-admin/authAdmin";

import { UserAuth } from "@/types/userAuth";
import { CategoryValues } from "@/types/category";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./add-category.module.css";

export interface AddCategoryProps {
  modalAddCategory: boolean;
  setModalAddCategory: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAddcategory: () => void;
  fetchCategories: () => void;
}

function AddCategory({
  modalAddCategory,
  setModalAddCategory,
  closeModalAddcategory,
  fetchCategories,
}: AddCategoryProps) {
  const { data: session, status } = useSession();
  const user: UserAuth | undefined = session?.user;  

  const dispatch = useDispatch<AppDispatch>();

  const errorMessages = {
    category: "Category is required",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryValues>();

  const onSubmit: SubmitHandler<CategoryValues> = async (data) => {
    const formData = new FormData();
    formData.append("category", data?.category);

    try {
      const response = await dispatch(createCategory({ formData, session }));
      
      if (response.payload && response.payload.status === 201) {
        toast.success("Category successfully added!", {
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
        fetchCategories();
        setModalAddCategory(false);
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
      toast.error("Category failed added!", {
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
    console.log("Add category failed");
  };

  return (
    <section>
      <Transition appear show={modalAddCategory} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeModalAddcategory}
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
            <div className="fixed inset-0 bg-[#0D0D0D] bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-md md:max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    encType="multipart/form-data"
                  >
                    <p className="w-full font-bold text-2xl text-gray-500">
                      Add category
                    </p>
                    <div className="border-b border-b-black pb-8">
                      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="category"
                            className="text-base text-gray-500"
                          >
                            Category
                          </label>
                          <div className="relative mt-2 flex items-center">
                            <input
                              type="text"
                              id="category"
                              autoComplete="off"
                              className="w-full px-4 py-2 rounded-md text-sm focus:outline-none focus:border-gray-500 text-gray-500 placeholder-gray-500 border border-gray-300"
                              {...register("category", {
                                required: errorMessages.category,
                              })}
                            />
                          </div>
                          {errors.category ? (
                            <p className="mt-1 text-red-500">
                              {errors.category.message}
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
                      >
                        Add Category
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

export default AuthAdmin(AddCategory);
