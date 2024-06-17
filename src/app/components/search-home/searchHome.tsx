"use client";

import { useRouter } from "next/navigation";

import React from "react";

export interface SearchMovieProps {
  id: string;
  filteredBooks: any;
  search: string;
  handleSearchBook: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchHome({
  id,
  filteredBooks,
  search,
  handleSearchBook,
}: SearchMovieProps) {
  const router = useRouter();

  const handleBookRoute = (id: number) => {
    router.push(`/pages/users/detail-book/${id}`);
    handleSearchBook({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>); // Reset search input
  };  

  return (
    <div className="w-full px-5 lg:px-0 z-10 mb-5 md:mb-0">
      <div className="flex justify-start">
        <div className="w-full">
          <div className="rounded-lg bg-transparent shadow-sm shadow-gray-600 bg-gradient-to-r from-blue-600 to-blue-500">
            <div className="flex items-center rounded-md bg-transparent shadow-sm shadow-gray-600 bg-gradient-to-r from-blue-600 to-blue-500">
              <div className="pl-2">
                <svg
                  className="w-6 h-6 fill-current text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="heroicon-ui"
                    d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id={id}
                className="w-full rounded-md bg-transparent text-sm text-white placeholder:text-white leading-tight focus:outline-none p-2 bg-gradient-to-r from-blue-600 to-blue-500"
                placeholder="Search books..."
                value={search}
                onChange={handleSearchBook}
              />
            </div>

            <div className="text-sm">
              {search === "" ? null : filteredBooks.length > 0 ? (
                filteredBooks?.map((book: any) => (
                  <div
                    className="my-2 p-2 flex justify-start items-center rounded-md cursor-pointer bg-transparent text-white hover:opacity-80"
                    key={book?.id}
                  >
                    <span className="w-2 h-2 mr-2 rounded-full bg-white"></span>
                    <p
                      className="text-left text-white"
                      onClick={() => handleBookRoute(book?.id)}
                    >
                      {book?.title}
                    </p>
                  </div>
                ))
              ) : (
                <div className="my-2 p-2 flex justify-start rounded-md cursor-pointer bg-tranparent text-white hover:opacity-80">
                  <p className="text-left text-sm text-white">Book not found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
