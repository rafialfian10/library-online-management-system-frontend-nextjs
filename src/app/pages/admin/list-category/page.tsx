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
import ButtonUpdate from "@/app/components/button-update/buttonUpdate";
import ButtonDelete from "@/app/components/button-delete/buttonDelete";
import Navbar from "@/app/components/navbar/navbar";
import Search from "@/app/components/search/search";
import AuthAdmin from "@/app/components/auth-admin/authAdmin";
import Pagination from "@/app/components/pagination/page";
import Loading from "@/app/loading";

function ListCategory({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const categories = useAppSelector(
    (state: RootState) => state.categorySlice.categories
  );
  const loading = useAppSelector(
    (state: RootState) => state.categorySlice.loading
  );

  const [dataCategory, setDataCategory] = useState<any>();
  const [modalAddCategory, setModalAddCategory] = useState(false);
  const [modalUpdateCategory, setModalUpdateCategory] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFound, setCategoryFound] = useState(true);

  function closeModalAddcategory() {
    setModalAddCategory(false);
  }

  function closeModalUpdatecategory() {
    setModalUpdateCategory(false);
  }

  const handleSearchCategory = (event: any) => {
    setSearch(event.target.value);
    setCategoryFound(true);
  };

  // pagination
  const page = searchParams["page"] ?? "1";
  const perPage = categories?.data?.length;

  const filteredCategories = categories?.data?.filter((category: any) =>
    category?.category?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchCategories({ page: Number(page), perPage }));
  }, [dispatch, session, status, page, perPage]);

  return (
    <>
      <Navbar />
      <section className="w-full min-h-screen mt-20">
        <AddCategory
          modalAddCategory={modalAddCategory}
          setModalAddCategory={setModalAddCategory}
          closeModalAddcategory={closeModalAddcategory}
          fetchCategories={() =>
            dispatch(fetchCategories({ page: Number(page), perPage }))
          }
        />
        <UpdateCategory
          modalUpdateCategory={modalUpdateCategory}
          setModalUpdateCategory={setModalUpdateCategory}
          closeModalUpdatecategory={closeModalUpdatecategory}
          dataCategory={dataCategory}
          fetchCategories={() =>
            dispatch(fetchCategories({ page: Number(page), perPage }))
          }
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
                        {filteredCategories?.length > 0 ? (
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
                                    <ButtonUpdate
                                      data={category}
                                      title={null}
                                      isStatus={null}
                                      setData={setDataCategory}
                                      setModalUpdate={setModalUpdateCategory}
                                    />
                                    <span className="text-gray-500 font-bold mx-2">
                                      |
                                    </span>
                                    <ButtonDelete
                                      id={category?.id}
                                      title="category"
                                      fetchData={() =>
                                        dispatch(
                                          fetchCategories({
                                            page: Number(page),
                                            perPage: Number(perPage),
                                          })
                                        )
                                      }
                                      deleteData={() =>
                                        dispatch(
                                          deleteCategory({
                                            id: category?.id,
                                            session,
                                          })
                                        )
                                      }
                                    />
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
        <Pagination
          totalData={categories?.totalData}
          dataPerPage={categories?.data?.length}
          totalPage={categories?.totalPage}
          currentPage={categories?.currentPage}
        />
      </section>
    </>
  );
}

export default AuthAdmin(ListCategory);
