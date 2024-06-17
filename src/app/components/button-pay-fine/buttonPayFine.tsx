"use client";

import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import { updateFine } from "@/redux/features/fineSlice";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./button-pay-fine.module.css";

interface PayFineProps {
  fine: object;
  fineStatus: string;
  session: any;
  fetchFineByUser: () => void;
}

declare global {
  interface Window {
    snap: any;
  }
}

export default function ButtonPayFine({
  fine,
  fineStatus,
  session,
  fetchFineByUser,
}: PayFineProps) {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const handlePayFine = async (fine: any, e: any) => {
    e.preventDefault();
    try {
      const data: any = {
        idBook: fine?.idBook,
        totalDay: fine?.totalDay,
        totalFine: fine?.totalFine,
      };

      const formData = new FormData();
      formData.append("idBook", data.idBook);
      formData.append("totalDay", data.totalDay);
      formData.append("totalFine", data.totalFine);

      const response = await dispatch(
        updateFine({ formData, id: fine?.id, session })
      );

      if (response?.payload && response?.payload?.status === 200) {
        if (window.snap) {
          (window as any).snap.pay(response?.payload?.data?.payment?.token, {
            onSuccess: function (result: any) {
              toast.success(response?.payload?.message, {
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
              fetchFineByUser();
              router.push("/pages/users/list-fine");
            },
            onPending: function (result: any) {
              toast.warning("please make payment first", {
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
            },
            onError: function (result: any) {
              toast.error("cancel pay fine successfully", {
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
            },
            onClose: function () {
              toast.error("cancel pay fine successfully", {
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
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = process.env.MIDTRANS_CLIENT_KEY as string;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;

    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <button
      type="button"
      className={`px-3 py-1 font-medium rounded-md shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white ${
        fineStatus === "success" ? "line-through" : "hover:opacity-80"
      }`}
      onClick={(e) => {
        handlePayFine(fine, e);
      }}
      disabled={fineStatus === "success"}
    >
      Pay Fine
    </button>
  );
}
