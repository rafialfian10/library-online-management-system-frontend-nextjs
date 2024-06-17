"use client";

import { useSession } from "next-auth/react";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import AuthAdmin from "@/app/components/auth-admin/authAdmin";
import { updateFineByAdmin } from "@/redux/features/fineSlice";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface UpdateFineByAdminProps {
  modalUpdateFine: boolean;
  setModalUpdateFine: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalUpdateFine: () => void;
  dataFine: any;
  fetchFines: () => void;
}

function UpdateFine({
  modalUpdateFine,
  setModalUpdateFine,
  closeModalUpdateFine,
  dataFine,
  fetchFines,
}: UpdateFineByAdminProps) {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const [statusFine, setStatusFine] = useState(dataFine?.status);

  const handleUpdateFine = async (e: any) => {
    e.preventDefault();
    try {
      const data: any = {
        idBook: dataFine?.idBook,
        status: statusFine,
      };

      const formData = new FormData();
      formData.append("idBook", data.idBook);
      formData.append("status", data.status);

      const response = await dispatch(
        updateFineByAdmin({ formData, id: dataFine?.id, session })
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
        fetchFines();
        setModalUpdateFine(false);
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
      <Transition appear show={modalUpdateFine} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeModalUpdateFine}
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
                      Update Fine Status
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
                            Book
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-4 text-white font-bold text-center"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="border-b bg-white">
                          <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                            {dataFine?.user?.username}
                          </td>
                          <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                            {dataFine?.book?.title}
                          </td>
                          <td className="whitespace-nowrap px-2 py-4 font-medium text-center">
                            <select
                              value={statusFine}
                              onChange={(e) => setStatusFine(e.target.value)}
                             className="text-gray-500"
                            >
                              <option value="failed" className="text-gray-500" selected={dataFine?.status === "failed"}>Not Paid</option>
                              <option value="success" className="text-gray-500" selected={dataFine?.status === "success"}>Paid</option>
                            </select>
                          </td>
                        </tr>
                        <tr className="border-b bg-white">
                          <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center"></td>
                          <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center"></td>
                          <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-end">
                            <button
                              type="submit"
                              className="mr-3 px-3 py-1 rounded-md shadow bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white"
                              onClick={handleUpdateFine}
                            >
                              Update Status
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 rounded-md shadow bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white"
                              onClick={() => setModalUpdateFine(false)}
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

export default AuthAdmin(UpdateFine);
