"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { AppDispatch, useAppSelector } from "@/redux/store";
import DashboardUser from "@/app/pages/users/dashboard-user/page"

import { fetchBooks } from "@/redux/features/bookSlice";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const dispatch = useDispatch<AppDispatch>();

  const books = useAppSelector((state) => state.bookSlice.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, []);

  const page = searchParams["page"] ?? "1";
  const booksPerPage = searchParams["per-page"] ?? "3";

  const start = (Number(page) - 1) * Number(booksPerPage); // 0, 3, 6, 9
  const end = start + Number(booksPerPage); // 3, 6, 9, 12
  const currentBooks = books.slice(start, end); // the amount of movie data per page

  return (
    <section className="m-0 p-0">
      <DashboardUser />
      {/* <PaginationBook
        totalBooks={books?.length}
        firstPage={start > 0}
        lastPage={end < books?.length}
      /> */}
    </section>
  );
}
