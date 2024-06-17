"use client";

import "./button-update-transaction.module.css";

interface TransactionUpdateProps {
  transaction: object;
  isStatus: boolean;
  setDataTransaction: React.Dispatch<React.SetStateAction<object>>;
  setModalUpdateTransaction: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ButtonUpdateTransaction({
  transaction,
  isStatus,
  setModalUpdateTransaction,
  setDataTransaction,
}: TransactionUpdateProps) {
  return (
    <button
      type="button"
      className={`px-3 py-1 font-medium rounded-md shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white ${
        !isStatus ? "line-through" : "hover:opacity-80"
      }`}
      disabled={!isStatus}
      onClick={() => {
        setModalUpdateTransaction(true);
        setDataTransaction(transaction);
      }}
    >
      Update
    </button>
  );
}
