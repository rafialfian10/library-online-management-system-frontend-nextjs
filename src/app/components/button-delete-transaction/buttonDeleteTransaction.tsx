"use client";

import { useSession } from "next-auth/react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { deleteTransaction } from "@/redux/features/transactionSlice";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TransactionDeleteProps {
  transactionId: number;
  fetchTransactions: () => void;
}

export default function ButtonDeleteTransaction({ transactionId, fetchTransactions }: TransactionDeleteProps) {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteTransaction = async (id: number) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        html: "Delete this transaction",
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
          const response = await dispatch(deleteTransaction({ id, session }));
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
            fetchTransactions();
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
    onClick={() => handleDeleteTransaction(transactionId)}
  >
    Delete
  </button>

  );
}
