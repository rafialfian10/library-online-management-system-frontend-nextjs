"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import moment from "moment";

import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";

import Loading from "@/app/loading";
import { fetchBook } from "@/redux/features/bookSlice";
import { createTransaction } from "@/redux/features/transactionSlice";
import { UserAuth } from "@/types/userAuth";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/app/components/navbar/navbar";

interface IdParamsProps {
  params: { id: number };
}

export default function DetailMovie({ params }: IdParamsProps) {
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  const dispatch = useDispatch<AppDispatch>();

  const book = useAppSelector((state: RootState) => state.bookSlice.book);
  const loading = useAppSelector((state: RootState) => state.bookSlice.loading);

  useEffect(() => {
    dispatch(fetchBook({ id: params?.id }));
  }, [dispatch, session, status]);

  const router = useRouter();

  const handleBorrowBook = async (book: any, quantity: number) => {
    try {
      const data: any = {
        bookId: book?.id,
        transactionType: "Borrow",
        totalBook: quantity,
      };

      const formData = new FormData();
      formData.append("idBook", data.bookId);
      formData.append("transactionType", data.transactionType);
      formData.append("totalBook", data.totalBook);

      const response = await dispatch(createTransaction({ formData, session }));

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
        router.push("/pages/users/list-book-borrowed");
      } else if (
        (response.payload && response.payload.status === 401) ||
        (response.payload && response.payload.status === 500)
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
      console.log(error);
    }
  };

  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < book?.qty) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <>
      <Navbar />
      <section className="min-w-full min-h-screen mt-24">
        <div className="w-full px-4 md:px-10 lg:px-20 pb-10">
          {loading ? (
            <Loading />
          ) : (
            <div className="w-full">
              <div className="flex flex-col md:flex-row justify-start items-start gap-5">
                <div className="w-full md:w-1/3 mb-5 md:mb-0 flex justify-center md:justify-end">
                  {book?.image &&
                    book?.image !==
                      "http://localhost:5000/uploads/book/image/" && (
                      <Image
                        src={book?.image ? book?.image : ""}
                        alt={book?.title}
                        width={300}
                        height={300}
                        objectFit="cover"
                        className="rounded-lg shadow shadow-gray-400 overflow-hidden"
                        priority={true}
                      />
                    )}
                </div>
                <div className="w-full md:w-1/3 mb-5 md:mb-0">
                  <div className="mb-2 border-b-2 border-b-gray-500">
                    <p className="text-md text-gray-500 font-bold">Title</p>
                    <p className="text-sm text-gray-500">{book?.title}</p>
                  </div>
                  <div className="mb-2 border-b-2 border-b-gray-500">
                    <p className="text-md text-gray-500 font-bold">Category</p>
                    <div className="flex flex-row">
                      {book?.categories?.map((cat: any, index: number) => (
                        <p key={index} className="text-sm text-gray-500">
                          {cat?.category},
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="mb-2 border-b-2 border-b-gray-500">
                    <p className="text-md text-gray-500 font-bold">
                      Publication Date
                    </p>
                    <p className="text-sm text-gray-500">
                      {moment(book?.publicationDate).format("DD MMMM YYYY")}
                    </p>
                  </div>
                  <div className="mb-2 border-b-2 border-b-gray-500">
                    <p className="text-md text-gray-500 font-bold">ISBN</p>
                    <p className="text-sm text-gray-500">{book?.isbn}</p>
                  </div>
                  <div className="mb-2 border-b-2 border-b-gray-500">
                    <p className="text-md text-gray-500 font-bold">Pages</p>
                    <p className="text-sm text-gray-500">{book?.pages}</p>
                  </div>
                  <div className="mb-2 border-b-2 border-b-gray-500">
                    <p className="text-md text-gray-500 font-bold">Author</p>
                    <p className="text-sm text-gray-500">{book?.author}</p>
                  </div>
                  <div className="mb-2 border-b-2 border-b-gray-500">
                    <p className="text-md text-gray-500 font-bold">
                      Desription
                    </p>
                    <p className="text-sm text-gray-500">{book?.description}</p>
                  </div>
                </div>
                {userAuth?.data?.role &&
                userAuth?.data?.role?.role === "User" ? (
                  <div className="mt-5 w-full md:w-1/3 mb-5 md:mb-0 flex justify-end items-center">
                    <div className="flex flex-col justify-center items-end">
                      <div className="mb-5 flex justify-end items-center gap-5">
                        <p className="text-md text-gray-500 font-semibold">
                          Max<span className="text-red-500">({book?.qty})</span>{" "}
                          book
                        </p>
                        <button
                          onClick={handleDecrement}
                          className="text-xl px-3 py-1 rounded-lg font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white hover:opacity-80"
                        >
                          -
                        </button>
                        <p className="text-md text-gray-500">{quantity}</p>
                        <button
                          onClick={handleIncrement}
                          className="text-xl px-3 py-1 rounded-lg font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white hover:opacity-80"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleBorrowBook(book, quantity)}
                        className="p-2 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white hover:opacity-80"
                      >
                        Borrow Book
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
