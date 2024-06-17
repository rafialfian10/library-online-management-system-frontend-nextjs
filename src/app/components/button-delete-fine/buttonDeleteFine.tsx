"use client";

import { useSession } from "next-auth/react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { deleteFine } from "@/redux/features/fineSlice";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FineDeleteProps {
  fineId: number;
  fetchFines: () => void;
}

export default function ButtonDeleteFine({ fineId, fetchFines }: FineDeleteProps) {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteFine = async (id: number) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        html: "Delete this fine",
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
          const response = await dispatch(deleteFine({ id, session }));
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
            fetchFines();
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Transaction failed to delete!", {
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
    <button
    type="button"
    className="px-3 py-1 font-medium rounded-md shadow-sm bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white hover:opacity-80"
    onClick={() => handleDeleteFine(fineId)}
  >
    Delete
  </button>

  );
}
