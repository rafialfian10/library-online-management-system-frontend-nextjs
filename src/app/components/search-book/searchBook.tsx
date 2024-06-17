"use client";

import React from "react";

export interface SearchMovieProps {
  search: string;
  handleSearchBook: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBook({
  search,
  handleSearchBook,
}: SearchMovieProps) {
  return (
    <section className="flex flex-col py-6 m-h-screen">
      <div
        className="items-center justify-between w-full flex rounded-full p-2 mb-5 sticky bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white shadow shadow-gray-500"
        style={{ top: "5" }}
      >
        <div>
          <div className="mr-1 p-2 rounded-full bg-white hover:opacity-80 cursor-pointer">
            <svg
              className="w-6 h-6 text-gray-500 hover:text-black"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <input
          type="text"
          className="font-bold rounded-full w-full py-4 pl-4 text-gray-500 bg-white leading-tight focus:outline-none focus:shadow-outline lg:text-sm text-xs placeholder:text-gray-500"
          placeholder="Search"
          value={search}
          onChange={handleSearchBook}
        />
        <div className="mx-2 p-2 bg-white hover:opacity-80 cursor-pointer rounded-full">
          <svg
            className="w-6 h-6 text-gray-500 hover:text-black"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}