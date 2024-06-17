"use client";

import { useSession } from "next-auth/react";

import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import {
  fetchCategories,
  deleteCategory,
} from "@/redux/features/categorySlice";

import AddCategory from "../add-category/page";
import UpdateCategory from "../update-category/page";
import Search from "@/app/components/search/search";
import AuthAdmin from "@/app/components/auth-admin/authAdmin";
import Loading from "@/app/loading";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/app/components/navbar/navbar";

function ListCategory() {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const categories = useAppSelector(
    (state: RootState) => state.categorySlice.categories
  );
  const loading = useAppSelector(
    (state: RootState) => state.categorySlice.loading
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch, session, status]);

  const [dataCategory, setDataCategory] = useState<any>();
  const [modalAddCategory, setModalAddCategory] = useState(false);
  const [modalUpdateCategory, setModalUpdateCategory] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFound, setCategoryFound] = useState(true);

  const filteredCategories = categories.filter(
    (category: any) =>
      category?.category &&
      category.category.toLowerCase().includes(search.toLowerCase())
  );

  function closeModalAddcategory() {
    setModalAddCategory(false);
  }

  function closeModalUpdatecategory() {
    setModalUpdateCategory(false);
  }

  const handleDeleteCategory = async (id: number) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        html: "Delete this category",
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
          const response = await dispatch(deleteCategory({ id, session }));

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
            dispatch(fetchCategories());
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Category failed to delete!", {
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

  const handleSearchCategory = (event: any) => {
    setSearch(event.target.value);
    setCategoryFound(true);
  };

  return (
    <>
      <Navbar />
      <section className="w-full min-h-screen mt-20">
        <AddCategory
          modalAddCategory={modalAddCategory}
          setModalAddCategory={setModalAddCategory}
          closeModalAddcategory={closeModalAddcategory}
          fetchCategories={() => dispatch(fetchCategories())}
        />
        <UpdateCategory
          modalUpdateCategory={modalUpdateCategory}
          setModalUpdateCategory={setModalUpdateCategory}
          closeModalUpdatecategory={closeModalUpdatecategory}
          dataCategory={dataCategory}
          fetchCategories={() => dispatch(fetchCategories())}
        />
        <div className="w-full px-4 md:px-10 lg:px-20 pb-10">
          <div className="mb-5 flex justify-between">
            <p className="m-0 text-center font-bold text-2xl text-gray-500">
              List Category
            </p>
            <div className="flex align-middle text-center">
              <button
                type="button"
                className="py-2 px-3 rounded-lg text-sm font-bold shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white hover:opacity-80"
                onClick={() => setModalAddCategory(true)}
              >
                Add Category
              </button>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="min-w-full text-left text-sm font-light">
                        <thead className="bg-white font-medium bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 shadow shadow-gray-400">
                          <tr>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              No
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-white font-bold text-center flex items-center"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-white font-bold text-center"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <thead className="bg-white font-medium border-b-2 border-b-black">
                          <tr>
                            <th
                              scope="col"
                              className="px-2 text-gray-500 font-bold text-center"
                            ></th>
                            <th
                              scope="col"
                              className="text-gray-500 font-bold text-center flex items-center"
                            >
                              <Search
                                search={search}
                                handleSearch={handleSearchCategory}
                              />
                            </th>
                            <th
                              scope="col"
                              className="py-4 text-gray-500 font-bold text-center"
                            ></th>
                          </tr>
                        </thead>
                        {filteredCategories.length > 0 ? (
                          filteredCategories?.map((category: any, i: any) => {
                            return (
                              <tbody key={i}>
                                <tr className="border-b bg-white">
                                  <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                    {i++ + 1}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-500 text-left">
                                    {category?.category}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4 text-center">
                                    <button
                                      type="button"
                                      className="px-2 py-1 rounded-md font-medium shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white hover:opacity-80"
                                      onClick={() => {
                                        setModalUpdateCategory(true);
                                        setDataCategory(category);
                                      }}
                                    >
                                      Update
                                    </button>
                                    <span className="text-gray-500 font-bold mx-2">
                                      |
                                    </span>
                                    <button
                                      type="button"
                                      className="px-3 py-1 font-medium rounded-md shadow-sm bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white hover:opacity-80"
                                      onClick={() =>
                                        handleDeleteCategory(category?.id)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            );
                          })
                        ) : (
                          <tbody>
                            <tr className=" bg-white font-medium border-b-2 border-b-black">
                              <td
                                scope="col"
                                className="px-2 text-gray-500 text-center"
                              ></td>
                              <td
                                scope="col"
                                className="px-6 py-4 text-gray-500 text-left"
                              >
                                Category not found
                              </td>
                              <td
                                scope="col"
                                className="py-4 text-gray-500 text-center"
                              ></td>
                            </tr>
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default AuthAdmin(ListCategory);
