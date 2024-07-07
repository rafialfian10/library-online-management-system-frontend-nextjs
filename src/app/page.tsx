"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { AppDispatch, useAppSelector } from "@/redux/store";
import DashboardUser from "@/app/pages/users/dashboard-user/page"

import { fetchBooks } from "@/redux/features/bookSlice";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  const books = useAppSelector((state) => state.bookSlice.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, []);

  return (
    <section className="m-0 p-0">
      <DashboardUser />
    </section>
  );
}
