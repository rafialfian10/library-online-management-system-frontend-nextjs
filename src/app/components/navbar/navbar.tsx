"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";

import SearchHome from "../search-home/searchHome";
import { fetchUserAuth } from "@/redux/features/userSlice";
import { fetchBooks } from "@/redux/features/bookSlice";
import { UserAuth } from "@/types/userAuth";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./navbar.module.css";

import icon from "@/assets/img/logo-library-online.png";
import defaultPhoto from "@/assets/img/default-photo.png";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  const dispatch = useDispatch<AppDispatch>();

  const user = useAppSelector((state: RootState) => state.userSlice.user);
  const books = useAppSelector((state: RootState) => state.bookSlice.books);

  useEffect(() => {
      dispatch(fetchBooks());
      dispatch(fetchUserAuth({ session, status }));
  }, [dispatch, session, status]);

  const router = useRouter();

  const [search, setSearch] = useState("");

  const [moviesFound, setBooksFound] = useState(true);

  const handleSearchBook = (event: any) => {
    setSearch(event.target.value);
    setBooksFound(true);
  };

  const filteredBooks = books?.filter(
    (book: any) =>
      book?.title && book?.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (filteredBooks?.length === 0 && search !== "") {
      setBooksFound(false);
    } else {
      setBooksFound(true);
    }
  }, [filteredBooks, search]);

  const handleLogout = async (e: any) => {
    e.preventDefault();
    Swal.fire({
      title: '<span style="color: #6B7280;">Logout</span>',
      html: '<span style="color: #6B7280;">Are you sure you want to logout?</span>',
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
    }).then((result: any) => {
      if (result.isConfirmed) {
        toast.success("Logout Successfully!", {
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
        router.push("/");
        signOut();
      } else {
        Swal.close();
      }
    });
  };

  return (
    <Fragment>
      <Disclosure
        as="nav"
        className="w-full fixed top-0 z-20 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400"
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 z-20">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                <div className="flex flex-1 items-center justify-between max-md:ml-14 pr-3 sm:pr-0 sm:items-center max-sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/">
                      <Image
                        src={icon}
                        alt="icon"
                        width={120}
                        height={100}
                        className="mr-10"
                        priority={true}
                      />
                    </Link>
                    <div className="hidden sm:block">
                      <div className="fixed top-3">
                        <SearchHome
                          id="search1"
                          filteredBooks={filteredBooks}
                          search={search}
                          handleSearchBook={handleSearchBook}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile dropdown */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {userAuth?.data?.role?.role === "User" ? (
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          className="relative w-7 h-7 flex justify-center items-center rounded-full text-white focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-white shadow shadow-sky-900"
                        >
                          <span className="absolute" />
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="w-5 h-5" aria-hidden="true" />
                        </button>

                        <Menu as="div" className="relative">
                          <div>
                            <Menu.Button className="w-10 h-10 relative flex rounded-full overflow-hidden">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              {user?.photo &&
                              user?.photo !==
                                "http://localhost:5000/uploads/photo/" ? (
                                <Image
                                  src={user?.photo}
                                  alt={user?.username ?? "User"}
                                  width={45}
                                  height={45}
                                  className="rounded-full shadow-md shadow-sky-700"
                                  priority={true}
                                />
                              ) : (
                                <Image
                                  src={defaultPhoto}
                                  alt={user?.username ?? "User"}
                                  width={45}
                                  height={45}
                                  className="rounded-full shadow-md shadow-sky-700"
                                  priority={true}
                                />
                              )}
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow shadow-gray-500 bg-gradient-to-r from-sky-500 to-sky-400 ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href={`/pages/users/profile-user/${user?.id}`}
                                    className={classNames(
                                      active ? "hover:opacity-80" : "",
                                      "block px-4 py-2 text-sm text-white"
                                    )}
                                  >
                                    Your Profile
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/pages/users/list-book-borrowed"
                                    className={classNames(
                                      active ? "hover:opacity-80" : "",
                                      "block px-4 py-2 text-sm text-white"
                                    )}
                                  >
                                    List Book Borrowed
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/pages/users/list-book-returned"
                                    className={classNames(
                                      active ? "hover:opacity-80" : "",
                                      "block px-4 py-2 text-sm text-white"
                                    )}
                                  >
                                    List Book Returned
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/pages/users/list-fine"
                                    className={classNames(
                                      active ? "hover:opacity-80" : "",
                                      "block px-4 py-2 text-sm text-white"
                                    )}
                                  >
                                    List Fine
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    className={classNames(
                                      active ? "hover:opacity-80" : "",
                                      "w-full block px-4 py-2 text-start text-sm text-white"
                                    )}
                                    onClick={handleLogout}
                                  >
                                    Logout
                                  </button>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-3">
                        <Menu as="div" className="relative">
                          <div>
                            <Menu.Button className="w-10 h-10 relative flex rounded-full overflow-hidden">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              {user?.photo &&
                              user?.photo !==
                                "http://localhost:5000/uploads/photo/" ? (
                                <Image
                                  src={user?.photo}
                                  alt={user?.username ?? "Admin"}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                  priority={true}
                                />
                              ) : (
                                <Image
                                  src={defaultPhoto}
                                  alt={user?.username ?? "Admin"}
                                  width={40}
                                  height={40}
                                  priority={true}
                                />
                              )}
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1  shadow shadow-gray-500 bg-gradient-to-r from-sky-500 to-sky-400 ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href={`/pages/admin/profile-admin/${user?.id}`}
                                    className={classNames(
                                      active ? "hover:opacity-80" : "",
                                      "block px-4 py-2 text-sm text-white"
                                    )}
                                  >
                                    Your Profile
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/pages/admin/dashboard-admin"
                                    className={classNames(
                                      active ? "hover:opacity-80" : "",
                                      "block px-4 py-2 text-sm text-white"
                                    )}
                                  >
                                    List User
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/pages/admin/list-category"
                                    className={classNames(
                                      active ? "hover:opacity-80" : "",
                                      "block px-4 py-2 text-sm text-white"
                                    )}
                                  >
                                    List Category
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/pages/admin/list-book"
                                    className={classNames(
                                      active ? "hover:opacity-80" : "",
                                      "block px-4 py-2 text-sm text-white"
                                    )}
                                  >
                                    List Book
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/pages/admin/list-transaction"
                                    className={classNames(
                                      active ? "hover:opacity-80" : "",
                                      "block px-4 py-2 text-sm text-white"
                                    )}
                                  >
                                    List Transaction
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/pages/admin/list-fine"
                                    className={classNames(
                                      active ? "hover:opacity-80" : "",
                                      "block px-4 py-2 text-sm text-white"
                                    )}
                                  >
                                    List Fine
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    className={classNames(
                                      active ? "hover:opacity-80" : "",
                                      "w-full block px-4 py-2 text-start text-sm text-white"
                                    )}
                                    onClick={handleLogout}
                                  >
                                    Logout
                                  </button>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              {userAuth?.data?.role?.role === "User" ? (
                <div className="space-y-1 px-5 pb-3 pt-2 flex flex-col gap-1">
                  <Link
                    href={`/pages/users/profile-user/${user?.id}`}
                    className="mb-1 px-2 text-white hover:opacity-80"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/pages/users/list-book-borrowed"
                    className="mb-1 px-2 text-white hover:opacity-80"
                  >
                    List Book Borrowed
                  </Link>
                  <Link
                    href="/pages/users/list-book-returned"
                    className="mb-1 px-2 text-white hover:opacity-80"
                  >
                    List Book Returned
                  </Link>
                  <Link
                    href="/pages/users/list-fine"
                    className="mb-1 px-2 text-white hover:opacity-80"
                  >
                    List Fine
                  </Link>
                  <button
                    className="mb-1 px-2 text-start text-white hover:opacity-80"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1 px-5 pb-3 pt-2 flex flex-col gap-1">
                  <Link
                    href={`/pages/admin/profile-admin/${user?.id}`}
                    className="mb-1 px-2 text-white hover:opacity-80"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/pages/admin/dashboard-admin"
                    className="mb-1 px-2 text-white hover:opacity-80"
                  >
                    List User
                  </Link>
                  <Link
                    href="/pages/admin/list-category"
                    className="mb-1 px-2 text-white hover:opacity-80"
                  >
                    List Category
                  </Link>
                  <Link
                    href="/pages/admin/list-book"
                    className="mb-1 px-2 text-white hover:opacity-80"
                  >
                    List Book
                  </Link>
                  <Link
                    href="/pages/admin/list-transaction"
                    className="mb-1 px-2 text-white hover:opacity-80"
                  >
                    List Transaction
                  </Link>
                  <Link
                    href="/pages/admin/list-fine"
                    className="mb-1 px-2 text-white hover:opacity-80"
                  >
                    List Fine
                  </Link>
                  <button
                    className="mb-1 px-2 text-start text-white hover:opacity-80"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
              <SearchHome
                id="search2"
                filteredBooks={filteredBooks}
                search={search}
                handleSearchBook={handleSearchBook}
              />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </Fragment>
  );
}
