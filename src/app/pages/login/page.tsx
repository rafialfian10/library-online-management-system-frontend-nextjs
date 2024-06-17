"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { UserAuth } from "@/types/userAuth";
import { LoginValues } from "@/types/login";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
library.add(faEye, faEyeSlash);

import styles from "./login.module.css";

import google from "@/assets/img/google.png";
import icon from "@/assets/img/logo-library-online.png";

export default function Login() {
  const { data: session, status } = useSession();
  const user: UserAuth | undefined = session?.user;
  
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && user) {
      router.push("/pages/users/dashboard-user");
    }
  }, [status, user, router]);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const errorMessages = {
    email: "Email is required",
    password: "Password is required",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginValues>();

  const onSubmit: SubmitHandler<LoginValues> = async (data, e) => {
    e?.preventDefault();
    const result = signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {  
      // console.log(callback);
      if (callback?.status === 401) {
        toast.error("Login Failed!, wrong email or password", {
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
        return;
      } 

      if (callback?.ok) {
        toast.success("Login Successfully!", {
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

        setShowSuccessToast(true);
        router.push("/pages/users/dashboard-user");
        reset();
      }
    });
  };

  const onError = () => {
    console.log("Login failed");
  };

  useEffect(() => {
    if (showSuccessToast) {
      setTimeout(() => {
        toast.success(`Wellcome ${user?.data?.username}`, {
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

        setShowSuccessToast(false);
      }, 4000);
    }
  }, [showSuccessToast, user?.data?.username]);

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
                Sign in to continue access
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/3 p-5 flex flex-col md:flex-row rounded-lg shadow-lg bg-white">
          <div className="md:w-full bg-white p-5 rounded-lg  shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
              Sign In
            </h2>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
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
              <div className="mb-5">
                <div className="relative flex items-center">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    autoComplete="off"
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-md text-sm focus:outline-none focus:border-sky-300 text-gray-500 placeholder-gray-500 border border-gray-300"
                    {...register("password", {
                      required: errorMessages.password,
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
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white py-2 px-4 rounded-md focus:outline-none hover:opacity-80"
              >
                Sign In
              </button>
              <div className="text-center">
                <p className="mb-2 text-gray-500">or</p>
                <Link
                  href="/api/auth/signin"
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white rounded-md py-2 px-4 flex justify-center items-center hover:opacity-80"
                >
                  <Image src={google} alt="google" className="w-5 h-5 mr-2" />
                  <span>Sign In with Google</span>
                </Link>
              </div>
              <div className="col-span-full mt-2 text-center">
                <span className="text-sm text-center text-gray-500">
                  Don&rsquo;t have an account ?{" "}
                  <Link href="/pages/register"> Click Here</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
