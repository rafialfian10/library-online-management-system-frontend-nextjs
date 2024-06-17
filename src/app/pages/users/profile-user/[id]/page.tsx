"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import { fetchUserAuth, updateUser } from "@/redux/features/userSlice";

import Loading from "@/app/loading";
import AuthUser from "@/app/components/auth-user/authUser";

import { UserAuth } from "@/types/userAuth";
import { CheckAuthValues } from "@/types/checkAuth";

import "react-toastify/dist/ReactToastify.css";

import defaultPhoto from "@/assets/img/default-photo.png";
import Navbar from "@/app/components/navbar/navbar";

interface ProfileProps {
  params: { id: string };
}

function ProfileUser({ params }: ProfileProps) {
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  const dispatch = useDispatch<AppDispatch>();

  const user = useAppSelector((state: RootState) => state.userSlice.user);
  const loadingUser = useAppSelector(
    (state: RootState) => state.userSlice.loading
  );

  useEffect(() => {
    if (status === "authenticated" && userAuth?.data?.token) {
      dispatch(fetchUserAuth({ session, status }));
    }
  }, [dispatch, session, status]);

  const errorMessages = {
    username: "Username is required",
    email: "Email is required",
    gender: "Gender is required",
    phone: "Phone is required",
    address: "Address is required",
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckAuthValues>();

  useEffect(() => {
    setValue("username", user?.username);
    setValue("email", user?.email);
    setValue("gender", user?.gender);
    setValue("phone", user?.phone);
    setValue("address", user?.address);
    setValue("photo", user?.photo);
  }, [user, setValue]);

  const onSubmit: SubmitHandler<CheckAuthValues> = async (data) => {
    const formData = new FormData();
    formData.append("username", data?.username);
    formData.append("email", data?.email);
    formData.append("gender", data?.gender);
    formData.append("phone", data?.phone.toLocaleString());
    formData.append("address", data?.address);

    try {
      const response = await dispatch(
        updateUser({ formData, id: user?.id, session })
      );

      if (response.payload && response.payload.status === 200) {
        dispatch(fetchUserAuth({ session, status }));
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
      } else if (response.payload && response.payload.status === 400) {
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
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Profile failed updated!", {
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
    console.log("Update profile failed");
  };

  const handleUpdatePhoto = async (event: any) => {
    const selectedFile = event.target.files && event.target.files[0];

    if (selectedFile) {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      try {
        const response = await dispatch(
          updateUser({ formData, id: user?.id, session })
        );

        if (response.payload && response.payload.status === 200) {
          dispatch(fetchUserAuth({ session, status }));
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
        }
      } catch (e) {
        console.log("API Error:", e);
        toast.error("Photo failed updated!", {
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
    }
  };

  return (
    <>
      <Navbar />
      <section className="w-full max-h-screen mt-20 px-28 max-md:px-5">
        <p className="w-full font-bold text-2xl text-gray-500">My Profile</p>
        <div className="mt-5">
          {loadingUser ? (
            <Loading />
          ) : (
            <div className="w-full lg:w-1/2 h-auto flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 mb-14 lg:mb-0 mr-5">
                <form
                  encType="multipart/form-data"
                  className="flex flex-col justify-center items-center"
                >
                  {user &&
                  user?.photo &&
                  user?.photo !== "http://localhost:5000/uploads/photo/" ? (
                    <Image
                      src={user?.photo}
                      alt="photo-profile"
                      width={350}
                      height={350}
                      // layout="responsive"
                      objectFit="cover"
                      className="rounded-md shadow shadow-gray-400"
                      priority={true}
                    />
                  ) : (
                    <Image
                      src={defaultPhoto}
                      alt="photo-profile-default"
                      width={320}
                      height={320}
                      // layout="responsive"
                      objectFit="cover"
                      className="rounded-md shadow shadow-gray-400"
                      priority={true}
                    />
                  )}
                  <div className="mt-5 relative w-full">
                    <input
                      type="file"
                      id="photo"
                      className="w-full hidden absolute"
                      onChange={handleUpdatePhoto}
                    />
                    <button
                      type="button"
                      className="w-full px-3 py-1.5 rounded-md shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white hover:opacity-80"
                      onClick={() => {
                        const photo = document.getElementById("photo");
                        if (photo) {
                          photo.click();
                        }
                      }}
                    >
                      Change Photo Profile
                    </button>
                  </div>
                </form>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="w-full lg:w-1/2 mb-14 lg:mb-0"
              >
                <div className="px-4 py-2 flex flex-col-reverse lg:flex-col rounded-lg shadow shadow-gray-400">
                  <div className="col-span-full mb-5 text-start max-md:text-end">
                    <button
                      type="submit"
                      className="w-full p-2 rounded-md shadow-sm text-sm text-center bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white hover:opacity-80"
                    >
                      Update Profile
                    </button>
                  </div>
                  <div>
                    <div className="col-span-full mb-2">
                      <label
                        htmlFor="username"
                        className="text-base font-bold text-blue-400"
                      >
                        Username
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          id="username"
                          autoComplete="off"
                          placeholder=""
                          className="block w-full p-1 bg-transparent rounded-md outline-none border-none text-gray-500 placeholder:text-gray-500 ring-0 focus:ring-0 sm:text-sm sm:leading-6 shadow shadow-gray-300"
                          {...register("username", {
                            required: errorMessages.username,
                          })}
                        />
                      </div>
                      {errors.username ? (
                        <p className="text-xs text-red-500">
                          {errors.username.message}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-span-full mb-2">
                      <label
                        htmlFor="email"
                        className="text-base font-bold text-blue-400"
                      >
                        Email
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="email"
                          id="email"
                          autoComplete="off"
                          placeholder=""
                          className="block w-full p-1 bg-transparent rounded-md outline-none border-none text-gray-500 placeholder:text-gray-500 ring-0 focus:ring-0 sm:text-sm sm:leading-6 shadow shadow-gray-300"
                          {...register("email", {
                            required: errorMessages.email,
                          })}
                        />
                      </div>
                      {errors.email ? (
                        <p className="text-xs text-red-500">
                          {errors.email.message}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-span-full mb-2">
                      <label
                        htmlFor="gender"
                        className="text-base font-bold text-blue-400"
                      >
                        Gender
                      </label>
                      <div className="relative flex items-center">
                        <select
                          id="gender"
                          defaultValue=""
                          className="block w-full p-1 bg-transparent rounded-md outline-none border-none text-gray-500 placeholder:text-gray-500 ring-0 focus:ring-0 sm:text-sm sm:leading-6 shadow shadow-gray-300"
                          {...register("gender")}
                        >
                          <option value="" disabled hidden>
                            Select your gender
                          </option>
                          <option
                            value="male"
                            className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400"
                          >
                            Male
                          </option>
                          <option
                            value="female"
                            className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400"
                          >
                            Female
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-full mb-2">
                      <label
                        htmlFor="phone"
                        className="text-base font-bold text-blue-400"
                      >
                        Phone
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          id="phone"
                          autoComplete="off"
                          placeholder=""
                          className="block w-full p-1 bg-transparent rounded-md outline-none border-none text-gray-500 placeholder:text-gray-500 ring-0 focus:ring-0 sm:text-sm sm:leading-6 shadow shadow-gray-300"
                          {...register("phone", {
                            minLength: {
                              value: 11,
                              message: "Minimum 11 characters are required",
                            },
                            maxLength: {
                              value: 12,
                              message: "Maximum 12 characters are allowed",
                            },
                          })}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-full mb-2">
                      <label
                        htmlFor="address"
                        className="text-base font-bold text-blue-400"
                      >
                        Address
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          id="address"
                          autoComplete="off"
                          placeholder=""
                          className="block w-full p-1 bg-transparent rounded-md outline-none border-none text-gray-500 placeholder:text-gray-500 ring-0 focus:ring-0 sm:text-sm sm:leading-6 shadow shadow-gray-300"
                          {...register("address")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default AuthUser(ProfileUser);
