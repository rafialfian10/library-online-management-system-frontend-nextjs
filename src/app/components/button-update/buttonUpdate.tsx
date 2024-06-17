"use client";

import { Menu } from "@headlessui/react";

import "./button-update.module.css";

interface UpdateProps {
  data: object;
  title: string | null;
  isStatus: boolean | null;
  setData: React.Dispatch<React.SetStateAction<object>>;
  setModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ButtonUpdate({
  data,
  title,
  isStatus,
  setModalUpdate,
  setData,
}: UpdateProps) {
  return title !== null ? (
    <Menu.Item>
      {({ active }) => (
        <button
          type="button"
          className={classNames(
            active ? "text-white bg-sky-500 hover:bg-sky-600" : "text-white",
            "w-full text-left block px-4 py-2 text-sm"
          )}
          onClick={() => {
            setModalUpdate(true);
            setData(data);
          }}
        >
          Update Book
        </button>
      )}
    </Menu.Item>
  ) : (
    <button
      type="button"
      className={`px-3 py-1 font-medium rounded-md shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white ${
        !isStatus && isStatus !== null ? "line-through" : "hover:opacity-80"
      }`}
      disabled={!isStatus && isStatus !== null}
      onClick={() => {
        setModalUpdate(true);
        setData(data);
      }}
    >
      Update
    </button>
  );
}
