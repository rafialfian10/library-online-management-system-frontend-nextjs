"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import { registerUser } from "@/redux/features/userSlice";
import { UserAuth } from "@/types/userAuth";
import { RegisterValues } from "@/types/register";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
library.add(faEye, faEyeSlash);

import styles from "./register.module.css";

import icon from "@/assets/img/logo-library-online.png";

export default function Register() {
  const { data: session, status } = useSession();
  const user: UserAuth | undefined = session?.user;

  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const errorMessages = {
    username: "Username is required",
    email: "Email is required",
    password: "Password is required",
    passwordValidation:
      "Password must contain at least one uppercase and lowercase letter, one digit, and be at least 8 characters long.",
    phone: "Phone is required",
    phoneValidation: "Phone number must be 11-12 number characters long",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterValues>({
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<RegisterValues> = async (formData) => {
    try {
      const response = await dispatch(registerUser({ formData }));
      if (response.payload && response.payload.status === 201) {
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
        router.push(
          `/pages/validation-account?expiryTime=${response?.payload?.data?.otp?.ttl}`
        );
      } else if (response.payload.status === 400) {
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
    console.log("Register failed");
  };

  useEffect(() => {
    if (status === "authenticated" && user) {
      router.push("/pages/users/dashboard-user");
    }
  }, [status, user, router]);

  return (
    <div className="min-w-full min-h-screen m-0 p-2 md:p-10 flex flex-col justify-start md:justify-center items-start bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400">
      <div className="w-full h-full lg:h-500 flex flex-col lg:flex-row rounded-lg overflow-hidden">
        <div className="w-full lg:w-3/4 rounded-lg text-white bg-gradient-to-r from-sky-500 via-blue-500 to-blue-400 p-6">
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
              <p className="mb-5 text-xl font-bold p-0 lg:pr-20">
                Sign up to continue access
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/3 p-5 flex flex-col md:flex-row rounded-lg shadow-lg bg-white">
          <div className="md:w-full bg-white p-5 rounded-lg md:rounded-l-none md:rounded-r-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center md:text-left text-gray-500">
              Sign Up
            </h2>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <div className="mb-3">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="username"
                    autoComplete="off"
                    placeholder="Username"
                    className="w-full px-4 py-2 rounded-md text-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("username", {
                      required: errorMessages.username,
                    })}
                  />
                </div>
                {errors.username ? (
                  <p className="mt-1 text-red-500 text-left text-xs">
                    {errors.username.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="mb-3">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    id="email"
                    autoComplete="off"
                    placeholder="Email"
                    className="w-full px-4 py-2 rounded-md text-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("email", {
                      required: errorMessages.email,
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
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    autoComplete="off"
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-md text-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("password", {
                      required: errorMessages.password,
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*.])[A-Za-z\d@$%^&*#.,]{8,}$/,
                        message: errorMessages.passwordValidation,
                      },
                    })}
                  />
                  <span className={styles.eye_icon}>
                    {
                      <FontAwesomeIcon
                        className="text-[#D2D2D2]"
                        icon={passwordVisible ? "eye-slash" : "eye"}
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      />
                    }
                  </span>
                </div>
                {errors.password ? (
                  <p className="mt-1 text-red-500 text-left text-xs">
                    {errors.password.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="mb-5">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="phone"
                    autoComplete="off"
                    placeholder="Phone"
                    className="w-full px-4 py-2 rounded-md text-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("phone", {
                      required: errorMessages.phone,
                      pattern: {
                        value: /^\d{11,12}$/,
                        message: errorMessages.phoneValidation,
                      },
                    })}
                  />
                </div>
                {errors.phone ? (
                  <p className="mt-1 text-red-500 text-left text-xs">
                    {errors.phone.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white py-2 px-4 rounded-md focus:outline-none hover:opacity-80"
              >
                Sign Up
              </button>
              <div className="col-span-full mt-2">
                <p className="text-sm text-center text-gray-500">
                  Already have an account ?{" "}
                  <Link href="/pages/login"> Click Here </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
