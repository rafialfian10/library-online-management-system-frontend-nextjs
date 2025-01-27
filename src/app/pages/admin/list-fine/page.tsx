"use client";

import { useSession } from "next-auth/react";

import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";

import DetailFine from "@/app/components/detail-fine/page";
import UpdateFine from "@/app/pages/admin/update-fine/page";
import ButtonUpdate from "@/app/components/button-update/buttonUpdate";
import ButtonDelete from "@/app/components/button-delete/buttonDelete";
import Navbar from "@/app/components/navbar/navbar";
import Search from "@/app/components/search/search";
import Pagination from "@/app/components/pagination/page";
import Loading from "@/app/loading";
import AuthAdmin from "@/app/components/auth-admin/authAdmin";
import { deleteFine, fetchFineByAdmin } from "@/redux/features/fineSlice";

function ListFine({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const fines = useAppSelector((state: RootState) => state.fineSlice.fines);
  const loading = useAppSelector((state: RootState) => state.fineSlice.loading);

  const [dataFine, setDataFine] = useState<any>();
  const [modalDetailFine, setModalDetailFine] = useState(false);
  const [modalUpdateFine, setModalUpdateFine] = useState(false);
  const [fineFound, setFineFound] = useState(true);
  const [search, setSearch] = useState("");

  // pagination
  const page = searchParams["page"] ?? "1";
  const perPage = fines?.data?.length;

  function closeModalDetailFine() {
    setModalDetailFine(false);
  }

  function closeModalUpdateFine() {
    setModalUpdateFine(false);
  }

  const handleSearchTransaction = (event: any) => {
    setSearch(event.target.value);
    setFineFound(true);
  };

  const filteredFines = fines?.data?.filter((fine: any) => {
    const searchLower = search.toLowerCase();

    return (
      fine?.user?.username?.toLowerCase().includes(searchLower) ||
      fine?.book?.title?.toLowerCase().includes(searchLower) ||
      fine?.totalDay?.toString().includes(searchLower) ||
      fine?.totalFine?.toString().includes(searchLower) ||
      (searchLower === "paid" && fine?.status?.toLowerCase() === "success") ||
      (searchLower === "not paid" &&
        (fine?.status?.toLowerCase() === "failed" ||
          fine?.status?.toLowerCase() === "pending"))
    );
  });

  useEffect(() => {
    dispatch(
      fetchFineByAdmin({ session, status, page: Number(page), perPage })
    );
  }, [dispatch, session, status, page, perPage]);

  return (
    <>
      <Navbar />
      <section className="w-full min-h-screen mt-20">
        <DetailFine
          modalDetailFine={modalDetailFine}
          setModalDetailFine={setModalDetailFine}
          closeModalDetailFine={closeModalDetailFine}
          dataFine={dataFine}
        />
        <UpdateFine
          modalUpdateFine={modalUpdateFine}
          setModalUpdateFine={setModalUpdateFine}
          closeModalUpdateFine={closeModalUpdateFine}
          dataFine={dataFine}
          fetchFines={() =>
            dispatch(
              fetchFineByAdmin({ session, status, page: Number(page), perPage })
            )
          }
        />
        <div className="w-full px-4 md:px-10 lg:px-20 pb-10">
          <div className="mb-5 flex justify-between">
            <p className="m-0 text-center font-bold text-2xl text-gray-500">
              List Fine
            </p>
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
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Username
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Book
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Total<span className="text-transparent">x</span>
                              Day
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Total<span className="text-transparent">x</span>
                              Fine
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
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
                                handleSearch={handleSearchTransaction}
                              />
                            </th>
                            <th
                              scope="col"
                              className="py-4 text-gray-500 font-bold text-center"
                            ></th>
                          </tr>
                        </thead>
                        {filteredFines?.length > 0 ? (
                          filteredFines?.map((fine: any, i: any) => {
                            return (
                              <tbody key={i}>
                                <tr className="border-b bg-white">
                                  <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                    {i++ + 1}
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                    {fine?.user?.username}
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                    {fine?.book?.title}
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                    {fine?.totalDay}
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                    {fine?.totalFine}
                                  </td>
                                  <td
                                    className={`whitespace-nowrap px-2 py-4 font-medium text-center ${
                                      fine?.status === "success"
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {fine?.status === "success"
                                      ? "Paid"
                                      : "Not Paid"}
                                  </td>
                                  <td className="flex flex-col justify-center items-center whitespace-nowrap px-6 py-4 text-center">
                                    <button
                                      type="button"
                                      className="mb-3 px-3 py-1 font-medium rounded-md shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white hover:opacity-80"
                                      onClick={() => {
                                        setModalDetailFine(true);
                                        setDataFine(fine);
                                      }}
                                    >
                                      Detail Fine
                                    </button>
                                    <div className="flex justify-center gap-2">
                                      <ButtonUpdate
                                        data={fine}
                                        title={null}
                                        isStatus={null}
                                        setData={setDataFine}
                                        setModalUpdate={setModalUpdateFine}
                                      />
                                      <span className="text-gray-500 font-bold text-xl">
                                        {" "}
                                        |{" "}
                                      </span>
                                      <ButtonDelete
                                        id={fine?.id}
                                        title="fine"
                                        fetchData={() =>
                                          dispatch(
                                            fetchFineByAdmin({
                                              session,
                                              status,
                                              page: Number(page),
                                              perPage,
                                            })
                                          )
                                        }
                                        deleteData={() =>
                                          dispatch(
                                            deleteFine({
                                              id: fine?.id,
                                              session,
                                            })
                                          )
                                        }
                                      />
                                    </div>
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
                                Fine not found
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
          totalData={fines?.totalData}
          dataPerPage={fines?.data?.length}
          totalPage={fines?.totalPage}
          currentPage={fines?.currentPage}
        />
      </section>
    </>
  );
}

export default AuthAdmin(ListFine);
