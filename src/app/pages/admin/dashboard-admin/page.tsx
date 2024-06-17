"use client";

import { useSession } from "next-auth/react";

import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";

import Search from "@/app/components/search/search";
import AuthAdmin from "@/app/components/auth-admin/authAdmin";
import { deleteUser, fetchUsers } from "@/redux/features/userSlice";
import Loading from "@/app/loading";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/app/components/navbar/navbar";

function DashboardAdmin() {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const users = useAppSelector((state: RootState) => state.userSlice.users);
  const loading = useAppSelector((state: RootState) => state.userSlice.loading);

  useEffect(() => {
    dispatch(fetchUsers({ session, status }));
  }, [dispatch, session, status]);

  const [search, setSearch] = useState("");
  const [userFound, setuserFound] = useState(true);

  const filteredUsers = users.filter(
    (username: any) =>
      username?.username &&
      username.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteUser = async (id: number) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        html: "Delete this user",
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
          const response = await dispatch(deleteUser({ id, session }));
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
            dispatch(fetchUsers({ session, status }));
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("User failed to delete!", {
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

  const handleSearchUser = (event: any) => {
    setSearch(event.target.value);
    setuserFound(true);
  };

  return (
    <>
      <Navbar />
      <section className="w-full min-h-screen mt-20">
        <div className="w-full px-4 md:px-10 lg:px-20 pb-10">
          <div className="mb-5 flex justify-between">
            <p className="m-0 text-center font-bold text-2xl text-gray-500">
              List User
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
                              className="py-4 text-white font-bold text-center"
                            >
                              No
                            </th>
                            <th
                              scope="col"
                              className="py-4 text-white font-bold text-center"
                            >
                              Username
                            </th>
                            <th
                              scope="col"
                              className="py-4 text-white font-bold text-center"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="py-4 text-white font-bold text-center"
                            >
                              Email<span className="text-blue-500">x</span>
                              Verified
                            </th>
                            <th
                              scope="col"
                              className="py-4 text-white font-bold text-center"
                            >
                              Phone
                            </th>
                            <th
                              scope="col"
                              className="py-4 text-white font-bold text-center"
                            >
                              Gender
                            </th>
                            <th
                              scope="col"
                              className="py-4 text-white font-bold text-center"
                            >
                              Address
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
                              className="text-gray-500 font-bold text-center flex justify-center items-center"
                            >
                              <Search
                                search={search}
                                handleSearch={handleSearchUser}
                              />
                            </th>
                            <th
                              scope="col"
                              className="py-4 text-gray-500 font-bold text-center"
                            ></th>
                          </tr>
                        </thead>
                        {filteredUsers.length > 0 ? (
                          filteredUsers?.map((user: any, i: any) => {
                            return (
                              <tbody key={i}>
                                <tr className="border-b bg-white">
                                  <td className="whitespace-nowrap py-4 font-medium text-gray-500 text-center">
                                    {i++ + 1}
                                  </td>
                                  <td className="whitespace-nowrap py-4 font-medium text-gray-500 text-center">
                                    {user?.username}
                                  </td>
                                  <td className="whitespace-nowrap py-4 font-medium text-gray-500 text-center">
                                    {user?.email}
                                  </td>
                                  <td className="whitespace-nowrap py-4 font-medium text-gray-500 text-center">
                                    {user?.isEmailVerified ? "Yes" : "No"}
                                  </td>
                                  <td className="whitespace-nowrap py-4 font-medium text-gray-500 text-center">
                                    {user?.phone}
                                  </td>
                                  <td className="whitespace-nowrap py-4 font-medium text-gray-500 text-center">
                                    {user?.gender}
                                  </td>
                                  <td className="whitespace-nowrap py-4 font-medium text-gray-500 text-center">
                                    {user?.address}
                                  </td>
                                  <td className="whitespace-nowrap py-4 text-center">
                                    <button
                                      type="button"
                                      className="px-3 py-1 font-medium rounded-md shadow-sm bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white hover:opacity-80"
                                      onClick={() => handleDeleteUser(user?.id)}
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
                                User not found
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

export default AuthAdmin(DashboardAdmin);
