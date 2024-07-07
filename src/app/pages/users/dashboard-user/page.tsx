"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import { fetchBooks } from "@/redux/features/bookSlice";

import Navbar from "@/app/components/navbar/navbar";
import Pagination from "@/app/components/pagination/page";
import Loading from "@/app/loading";
import AuthUser from "@/app/components/auth-user/authUser";

function DashboardUser({
  searchParams = {},
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const books = useAppSelector((state: RootState) => state.bookSlice.books);
  const loading = useAppSelector((state: RootState) => state.bookSlice.loading);

  // pagination
  const page = searchParams["page"] ?? "1";
  const perPage = books?.data?.length;

  useEffect(() => {
    dispatch(fetchBooks({ page: Number(page), perPage }));
  }, [dispatch, session, status, page, perPage]);

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
            {books?.data?.length > 0 ? (
              books?.data?.map((book: any, i: any) => {
                return (
                  <div
                    className="w-30% flex flex-col justify-between rounded-lg overflow-hidden shadow-sm shadow-gray-500 bg-white"
                    key={i}
                  >
                    <div className="w-full h-60">
                      {book?.image &&
                        book?.image !==
                          "http://localhost:5000/uploads/book/image" && (
                          <Image
                            src={book?.image}
                            alt={book?.title}
                            width={200}
                            height={300}
                            className="w-full h-full object-fit"
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
      <Pagination
        totalData={books?.totalData}
        dataPerPage={books?.data?.length}
        totalPage={books?.totalPage}
        currentPage={books?.currentPage}
      />
    </section>
  );
}

export default AuthUser(DashboardUser);
