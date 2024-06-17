"use client";

import { useSession } from "next-auth/react";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import AuthAdmin from "@/app/components/auth-admin/authAdmin";
import { updateUser } from "@/redux/features/userSlice";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface UpdateUserProps {
  modalUpdateUser: boolean;
  setModalUpdateUser: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalUpdateUser: () => void;
  dataUser: any;
  fetchUsers: () => void;
}

function UpdateUser({
  modalUpdateUser,
  setModalUpdateUser,
  closeModalUpdateUser,
  dataUser,
  fetchUsers,
}: UpdateUserProps) {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const [role, setRole] = useState(dataUser?.role?.id);

  const handleUpdateUser = async (e: any) => {
    e.preventDefault();
    try {
      const data: any = {
        roleId: role,
      };

      const formData = new FormData();
      formData.append("roleId", data.roleId);

      const response = await dispatch(
        updateUser({ formData, id: dataUser?.id, session })
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
        fetchUsers();
        setModalUpdateUser(false);
      } else if (
        (response.payload && response.payload.status === 401) ||
        (response.payload && response.payload.status === 404) ||
        (response.payload && response.payload.status === 500)
      ) {
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <Transition appear show={modalUpdateUser} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeModalUpdateUser}
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
                  <div className="overflow-x-auto">
                    <p className="w-full mb-5 font-bold text-2xl text-gray-500">
                      Update User
                    </p>
                    <table className="min-w-full text-left text-sm font-light overflow-x-auto">
                      <thead className="bg-white font-medium bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 shadow shadow-gray-400">
                        <tr>
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
                            Role
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="border-b bg-white">
                          <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                            {dataUser?.username}
                          </td>
                          <td className="whitespace-nowrap px-2 py-4 font-medium text-center">
                            <select
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                              className="text-gray-500"
                            >
                              <option
                                value="1"
                                className="text-gray-500"
                                selected={dataUser?.role?.id === 1}
                              >
                                Super Admin
                              </option>
                              <option
                                value="2"
                                className="text-gray-500"
                                defaultValue={role}
                                selected={dataUser?.role?.id === 2}
                              >
                                Admin
                              </option>
                              <option
                                value="3"
                                className="text-gray-500"
                                selected={dataUser?.role?.id === 3}
                              >
                                User
                              </option>
                            </select>
                          </td>
                        </tr>
                        <tr className="border-b bg-white">
                          <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center"></td>
                          <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-end">
                            <button
                              type="submit"
                              className="mr-3 px-3 py-1 rounded-md shadow bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white"
                              onClick={handleUpdateUser}
                            >
                              Update
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 rounded-md shadow bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white"
                              onClick={() => setModalUpdateUser(false)}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}

export default AuthAdmin(UpdateUser);
