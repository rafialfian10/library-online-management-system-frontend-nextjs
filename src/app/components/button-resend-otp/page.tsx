"use client";

import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import { resendOtp } from "@/redux/features/userSlice";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

export interface ResendOtpProps {
  email: string;
  expiryTime: string;
}

const ButtonResendOtp = ({ email, expiryTime }: ResendOtpProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [expiryTimeSeconds, setExpiryTimeSeconds] = useState<number | null>(
    expiryTime ? parseInt(expiryTime) : null
  );

  const handleResendOtp = async () => {
    try {
      const response = await dispatch(resendOtp({ formData: { email } }));
      setExpiryTimeSeconds(response?.payload?.data?.ttl);

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
      } else if (
        response.payload.status === 400 ||
        response.payload.status === 404
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
      toast.error("An error occurred. Please try again later.", {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setExpiryTimeSeconds((prevTime) => (prevTime ? prevTime - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-2 border-white flex justify-between">
      <p className="text-sm text-red-500">
        {expiryTimeSeconds !== null
          ? moment.utc(expiryTimeSeconds * 1000).format("mm:ss")
          : ""}
      </p>
      <button
        className="text-sm text-gray-500 underline"
        onClick={handleResendOtp}
      >
        Resend Otp
      </button>
    </div>
  );
};

export default ButtonResendOtp;
