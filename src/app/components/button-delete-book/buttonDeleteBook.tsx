"use client";

import { useSession } from "next-auth/react";
import { Menu } from "@headlessui/react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { deleteBook } from "@/redux/features/bookSlice";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface BookDeleteProps {
  bookId: number;
  fetchBooks: () => void;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ButtonDeleteBook({
  bookId,
  fetchBooks,
}: BookDeleteProps) {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteBook = async (id: number) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        html: "Delete this book",
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
          const response = await dispatch(deleteBook({ id, session }));
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
            fetchBooks();
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Book failed to delete!", {
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
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          type="button"
          className={classNames(
            active ? "text-white bg-sky-500 hover:bg-sky-600" : "text-white",
            "w-full text-left block px-4 py-2 text-sm"
          )}
          onClick={() => handleDeleteBook(bookId)}
        >
          Delete Book
        </button>
      )}
    </Menu.Item>
  );
}
