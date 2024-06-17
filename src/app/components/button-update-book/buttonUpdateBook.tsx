"use client";

import { Menu } from "@headlessui/react";

import "./button-update-book.module.css";

interface BookUpdateProps {
  book: object;
  setDataBook: React.Dispatch<React.SetStateAction<object>>;
  setModalUpdateBook: React.Dispatch<React.SetStateAction<boolean>>;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ButtonUpdateMovie({
  book,
  setDataBook,
  setModalUpdateBook,
}: BookUpdateProps) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          type="button"
          className={classNames(
            active
              ? "text-white bg-sky-500 hover:bg-sky-600"
              : "text-white",
            "w-full text-left block px-4 py-2 text-sm"
          )}
          onClick={() => {
            setModalUpdateBook(true);
            setDataBook(book);
          }}
        >
          Update Book
        </button>
      )}
    </Menu.Item>
  );
}
