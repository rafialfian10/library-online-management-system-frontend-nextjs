"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { Fragment, useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";

import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import { fetchBooks } from "@/redux/features/bookSlice";

import Loading from "@/app/loading";
import AuthUser from "@/app/components/auth-user/authUser";
import SearchBook from "@/app/components/search-book/searchBook";
import Navbar from "@/app/components/navbar/navbar";

function DashboardUser() {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const books = useAppSelector((state: RootState) => state.bookSlice.books);
  const loading = useAppSelector((state: RootState) => state.bookSlice.loading);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch, session, status]);

  const [dataBook, setDataBook] = useState<any>();
  const [modalUpdateBook, setModalUpdateBook] = useState(false);
  const [search, setSearch] = useState("");
  const [moviesFound, setMoviesFound] = useState(true);

  const handleSearchBook = (event: any) => {
    setSearch(event.target.value);
    setMoviesFound(true);
  };

  const filteredMovies = books?.filter(
    (book: any) =>
      book?.title && book?.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (filteredMovies.length === 0 && search !== "") {
      setMoviesFound(false);
    } else {
      setMoviesFound(true);
    }
  }, [filteredMovies, search]);

  return (
    <section className="w-full min-h-screen mt-20">
      <Navbar />
      <div className="w-full px-4 md:px-10 lg:px-20 pb-10">
        <div className="mb-5 flex justify-between">
          <p className="m-0 text-center font-bold text-2xl text-gray-500">
            List Book
          </p>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {filteredMovies?.length > 0 ? (
              filteredMovies?.map((book: any, i: any) => {
                return (
                  <div
                    className="w-30% flex flex-col justify-between rounded-lg overflow-hidden shadow-sm shadow-gray-500 bg-white"
                    key={i}
                  >
                    <div className="w-full h-52">
                      {book?.image &&
                        book?.image !==
                          "http://localhost:5000/uploads/book/image" && (
                          <Image
                            src={book?.image}
                            alt={book?.title}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                            priority={true}
                          />
                        )}
                    </div>
                    <div className="p-2">
                      <p className="mb-2 text-lg font-bold tracking-tight text-gray-500">
                        {book?.title}
                      </p>
                      <p className="mb-3 font-normal text-md text-gray-500">
                        {book?.description.length > 20
                          ? `${book?.description.substring(0, 20)}...`
                          : book?.description}
                      </p>
                      <a
                        href={`/pages/users/detail-book/${book?.id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center rounded-md shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white hover:opacity-80"
                      >
                        detail book
                        <svg
                          className="w-3.5 h-3.5 ml-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                            fillRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="w-full min-h-screen text-gray-500 dark:text-gray-500 text-left mt-2">
                Book not found.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default AuthUser(DashboardUser);
