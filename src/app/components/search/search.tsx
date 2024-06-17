"use client";

import React from "react";

export interface SearchcategoryProps {
  search: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Search({
  search,
  handleSearch,
}: SearchcategoryProps) {
  return (
    <div className="relative ml-5 my-2 ">
      <input
        type="search"
        className="font-normal rounded border-0 p-3 bg-transparent text-sm text-white placeholder:text-white leading-tight focus:outline-none shadow-sm shadow-gray-600 bg-gradient-to-r from-blue-600 to-blue-500"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
      />
      <div className="absolute  mt-3 mr-4 text-white top-0 right-0"></div>
    </div>
  );
}
