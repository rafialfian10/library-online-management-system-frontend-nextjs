"use client";

import { Menu } from "@headlessui/react";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface DeleteProps {
  id: number;
  title: string;
  fetchData: () => void;
  deleteData: () => Promise<any>;
}

export default function ButtonDelete({
  id,
  title,
  fetchData,
  deleteData,
}: DeleteProps) {
  const handleDeleteData = async (id: number) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        html: `Delete this ${title}`,
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
        confirmButtonColor: "#3B82F6",
        cancelButtonColor: "#CD2E71",
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          const response = await deleteData();
          console.log(response);

          if (response.payload && response.payload.status === 200) {
            toast.success(response.payload.message, {
              position: "top-right",
              autoClose: 3500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
              style: { marginTop: "65px" },
            });
            fetchData();
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error(`${title} failed to delete!`, {
        position: "top-right",
        autoClose: 5000,
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

  return title === "book" ? (
    <Menu.Item>
      {({ active }) => (
        <button
          type="button"
          className={classNames(
            active ? "text-white bg-sky-500 hover:bg-sky-600" : "text-white",
            "w-full text-left block px-4 py-2 text-sm"
          )}
          onClick={() => handleDeleteData(id)}
        >
          Delete Book
        </button>
      )}
    </Menu.Item>
  ) : (
    <button
      type="button"
      className="px-3 py-1 font-medium rounded-md shadow-sm bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white hover:opacity-80"
      onClick={() => handleDeleteData(id)}
    >
      Delete
    </button>
  );
}
