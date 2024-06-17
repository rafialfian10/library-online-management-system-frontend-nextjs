"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import ButtonResendOtp from "@/app/components/button-resend-otp/page";
import { verifyOtp } from "@/redux/features/userSlice";
import { UserAuth } from "@/types/userAuth";
import { VerifyOtpValues } from "@/types/verifyOtp";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import icon from "@/assets/img/logo-library-online.png";

export default function ValidationAccount() {
  const { data: session, status } = useSession();
  const user: UserAuth | undefined = session?.user;

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { expiryTime } = Object.fromEntries(searchParams);

  const [email, setEmail] = useState("");

  const errorMessages = {
    email: "Email is required",
    otp: "OTP is required",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VerifyOtpValues>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<VerifyOtpValues> = async (formData) => {
    try {
      const response = await dispatch(verifyOtp({ formData }));
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
        reset();
        router.push("/pages/login");
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

  const onError = () => {
    console.log("verify otp failed");
  };

  useEffect(() => {
    if (status === "authenticated" && user) {
      router.push("/pages/users/dashboard-user");
    }
  }, [status, user, router]);

  return (
    <div className="min-w-full min-h-screen m-0 p-2 md:p-10 flex flex-col justify-start md:justify-center items-start bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400">
      <div className="w-full h-full lg:h-500 flex flex-col lg:flex-row rounded-lg overflow-hidden">
        <div className="w-full lg:w-3/4 p-6 rounded-lg text-white bg-gradient-to-r from-sky-500 via-blue-500 to-blue-400">
          <div className=" h-full flex flex-col">
            <div className="w-full h-1/2 hidden md:block">
              <Image
                src={icon}
                alt="icon-library-online"
                width={200}
                height={200}
                className="mr-10"
                priority={true}
              />
            </div>
            <div className="w-full h-1/2 flex flex-col justify-start items-center">
              <h1 className="text-4xl font-bold mb-6 p-0 lg:pl-28">
                Welcome to Online Library
              </h1>
              <p className="mb-5 text-xl font-bold p-0 lg:pr-18">
                Verity Account to continue access
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/3 p-5 flex flex-col md:flex-row rounded-lg shadow-lg bg-white">
          <div className="md:w-full bg-white p-5 rounded-lg md:rounded-l-none md:rounded-r-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center md:text-left text-gray-500">
              Verify Account
            </h2>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <div className="mb-3">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="email"
                    autoComplete="off"
                    placeholder="Username"
                    className="w-full px-4 py-2 rounded-md text-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("email", {
                      required: errorMessages.email,
                      onChange: (e) => setEmail(e.target.value),
                    })}
                  />
                </div>
                {errors.email ? (
                  <p className="mt-1 text-red-500 text-left text-xs">
                    {errors.email.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="mb-3">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="otp"
                    autoComplete="off"
                    placeholder="Token"
                    className="w-full px-4 py-2 rounded-md text-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("otp", {
                      required: errorMessages.otp,
                    })}
                  />
                </div>
                {errors.otp ? (
                  <p className="mt-1 text-red-500 text-left text-xs">
                    {errors.otp.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <button
                type="submit"
                className="w-full mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white py-2 px-4 rounded-md focus:outline-none hover:opacity-80"
              >
                Verify
              </button>
            </form>
            <ButtonResendOtp email={email} expiryTime={expiryTime} />
            <div className="col-span-full mt-2 text-center">
              <span className="text-sm text-center text-gray-500">
                Don&rsquo;t have an account ?{" "}
                <Link href="/pages/register"> Click Here</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
