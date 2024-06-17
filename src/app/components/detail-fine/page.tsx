"use client";

import moment from "moment";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import "./detail-fine.module.css";

export interface DetailFineProps {
  modalDetailFine: boolean;
  setModalDetailFine: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalDetailFine: () => void;
  dataFine: any;
}

function DetailTransaction({
  modalDetailFine,
  setModalDetailFine,
  closeModalDetailFine,
  dataFine,
}: DetailFineProps) {
  return (
    <section>
      <Transition appear show={modalDetailFine} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={closeModalDetailFine}
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
                  <div>
                    <div className="w-full flex justify-end">
                      <button
                        onClick={() => setModalDetailFine(false)}
                        className="text-white text-lg px-2 rounded-full bg-red-500 hover:opacity-80"
                      >
                        X
                      </button>
                    </div>
                    <p className="w-full mb-5 font-bold text-2xl text-gray-500">
                      Detail Fine
                    </p>
                    <div className="mb-5 overflow-x-auto">
                      <p className="w-full font-bold text-lg text-gray-500">
                        Fine
                      </p>
                      <table className="min-w-full text-left text-sm font-light">
                        <thead className="bg-white font-medium bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 shadow shadow-gray-400">
                          <tr>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              User
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
                              Todal<span className="text-transparent">x</span>
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
                            <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                              {dataFine?.totalDay}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                              {dataFine?.totalFine}
                            </td>
                            <td
                              className={`whitespace-nowrap px-2 py-4 font-medium text-center ${
                                dataFine?.status === "success"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {dataFine?.status === "success"
                                ? "Paid"
                                : "Not Paid"}
                            </td>
                          </tr>
                        </tbody>
                        <thead className="bg-white font-medium border-b-2 border-b-black">
                          <tr>
                            <th
                              scope="col"
                              className="px-2 text-gray-500 font-bold text-center"
                            ></th>
                            <th
                              scope="col"
                              className="py-4 text-gray-500 font-bold text-center"
                            ></th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                    <div className="mb-5 overflow-x-auto">
                      <p className="w-full font-bold text-lg text-gray-500">
                        User
                      </p>
                      <table className="min-w-full text-left text-sm font-light">
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
                              Email
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Phone
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Gender
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Address
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b bg-white">
                            <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                              {dataFine?.user?.username}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                              {dataFine?.user?.email}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                              {dataFine?.user?.phone}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                              {dataFine?.user?.gender}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                              {dataFine?.user?.address}
                            </td>
                          </tr>
                        </tbody>
                        <thead className="bg-white font-medium border-b-2 border-b-black">
                          <tr>
                            <th
                              scope="col"
                              className="px-2 text-gray-500 font-bold text-center"
                            ></th>
                            <th
                              scope="col"
                              className="py-4 text-gray-500 font-bold text-center"
                            ></th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                    <div className="mb-5 overflow-x-auto">
                      <p className="w-full font-bold text-lg text-gray-500">
                        Book
                      </p>
                      <table className="min-w-full text-left text-sm font-light">
                        <thead className="bg-white font-medium bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 shadow shadow-gray-400">
                          <tr>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Title
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Publication
                              <span className="text-transparent">x</span>Date
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              ISBN
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              pages
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Author
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b bg-white">
                            <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                              {dataFine?.book?.title}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                              {moment(dataFine?.book?.publicationDate).format(
                                "DD MMMM YYYY"
                              )}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                              {dataFine?.book?.isbn}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                              {dataFine?.book?.pages}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                              {dataFine?.book?.author}
                            </td>
                          </tr>
                        </tbody>
                        <thead className="bg-white font-medium border-b-2 border-b-black">
                          <tr>
                            <th
                              scope="col"
                              className="px-2 text-gray-500 font-bold text-center"
                            ></th>
                            <th
                              scope="col"
                              className="py-4 text-gray-500 font-bold text-center"
                            ></th>
                          </tr>
                        </thead>
                      </table>
                    </div>
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

export default DetailTransaction;
