"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { Fragment, useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";

import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import { fetchBooks } from "@/redux/features/bookSlice";

import UpdateBook from "../update-book/page";
import SearchBook from "@/app/components/search-book/searchBook";
import ButtonUpdateBook from "@/app/components/button-update-book/buttonUpdateBook";
import ButtonDeleteBook from "@/app/components/button-delete-book/buttonDeleteBook";
import AuthAdmin from "@/app/components/auth-admin/authAdmin";
import Loading from "@/app/loading";

import list from "@/assets/img/titik3.png";

function ListBook() {
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

  function closeModalUpdateBook() {
    setModalUpdateBook(false);
    fetchBooks();
  }

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
      <UpdateBook
        modalUpdateBook={modalUpdateBook}
        setModalUpdateBook={setModalUpdateBook}
        closeModalUpdateBook={closeModalUpdateBook}
        dataBook={dataBook}
        fetchBooks={() => dispatch(fetchBooks())}
      />
      <div className="w-full px-4 md:px-10 lg:px-20 pb-10">
        <SearchBook search={search} handleSearchBook={handleSearchBook} />
        <div className="mb-5 flex justify-between">
          <p className="m-0 text-center font-bold text-2xl text-gray-500">
            List Book
          </p>
          <div className="flex align-middle text-center">
            <Link
              href="/pages/admin/add-book"
              className="m-0 p-2 rounded font-bold shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white hover:opacity-80"
            >
              Add Book
            </Link>
          </div>
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
                    <Menu
                      as="div"
                      className="absolute inline-block text-left self-end"
                    >
                      <div>
                        <Menu.Button className="inline-flex w-10 justify-center gap-1 bg-transparent p-1">
                          <Image
                            src={list ? list : ""}
                            alt="list"
                            width={100}
                            height={100}
                            priority={true}
                          />
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white shadow shadow-gray-500">
                          <div className="py-1">
                            <ButtonUpdateBook
                              book={book}
                              setModalUpdateBook={setModalUpdateBook}
                              setDataBook={setDataBook}
                            />
                            <ButtonDeleteBook
                              bookId={book?.id}
                              fetchBooks={() => dispatch(fetchBooks())}
                            />
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>

                    <div className="w-full h-52">
                      {book?.image &&
                        book?.image !==
                          "http://localhost:5000/uploads/book/image" && (
                          <Image
                            src={book?.image}
                            alt={book?.title}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover"
                            priority={true}
                          />
                        )}
                    </div>

                    <div className="p-5">
                      <p className="mb-2 text-2xl font-bold tracking-tight text-gray-500">
                        {book?.title}
                      </p>
                      <p className="mb-3 font-normal text-gray-500">
                        {book?.description.length > 30
                          ? `${book?.description.substring(0, 30)}...`
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

export default AuthAdmin(ListBook);
