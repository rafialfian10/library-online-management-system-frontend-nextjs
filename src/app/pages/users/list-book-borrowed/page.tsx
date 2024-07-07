"use client";

import { useSession } from "next-auth/react";

import { useState, useEffect } from "react";
import moment from "moment";

import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";

import DetailTransaction from "@/app/components/detail-transaction/page";
import Navbar from "@/app/components/navbar/navbar";
import Search from "@/app/components/search/search";
import Pagination from "@/app/components/pagination/page";
import Loading from "@/app/loading";
import AuthUser from "@/app/components/auth-user/authUser";
import { fetchTransactionBorrowByUser } from "@/redux/features/transactionSlice";
// import { createFine } from "@/redux/features/fineSlice";

function ListBookBorrowed({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { data: session, status } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const transactions = useAppSelector(
    (state: RootState) => state.transactionSlice.transactions
  );
  const loading = useAppSelector(
    (state: RootState) => state.transactionSlice.loading
  );

  const [dataTransaction, setDataTransaction] = useState<any>();
  const [modalDetailTransaction, setModalDetailTransaction] = useState(false);
  const [transactionFound, setTransactionFound] = useState(true);
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState(moment());
  const [alertedTransactions, setAlertedTransactions] = useState<any>([]);

  // pagination
  const page = searchParams["page"] ?? "1";
  const perPage = transactions?.data?.length;

  function closeModalDetailTransaction() {
    setModalDetailTransaction(false);
  }

  const handleSearchTransaction = (event: any) => {
    setSearch(event.target.value);
    setTransactionFound(true);
  };

  const filteredTransactions = transactions?.data?.filter(
    (transaction: any) => {
      const searchLower = search.toLowerCase();
      return (
        transaction?.transactionType?.toLowerCase().includes(searchLower) ||
        transaction?.user?.username?.toLowerCase().includes(searchLower) ||
        transaction?.book?.title?.toLowerCase().includes(searchLower) ||
        transaction?.totalBook?.toString().includes(searchLower) ||
        moment(transaction?.loanDate)
          .format("DD MMMM YYYY")
          .toLowerCase()
          .includes(searchLower) ||
        moment(transaction?.returnDate)
          .format("DD MMMM YYYY")
          .toLowerCase()
          .includes(searchLower) ||
        moment(transaction?.loanMaximum)
          .format("DD MMMM YYYY")
          .toLowerCase()
          .includes(searchLower) ||
        (transaction?.isStatus ? "Borrowed" : "Returned")
          .toLowerCase()
          .includes(searchLower)
      );
    }
  );

  useEffect(() => {
    dispatch(
      fetchTransactionBorrowByUser({ session, status, page: Number(page), perPage })
    );
  }, [dispatch, session, status, page, perPage]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const countdown = (transaction: any) => {
    const now = moment();
    const diffSeconds = moment(transaction?.returnDate).diff(now, "seconds");

    if (diffSeconds < 0) return null;

    const duration = moment.duration(diffSeconds * 1000);
    let remainingTime = "";
    if (duration.days() > 0) {
      remainingTime += `${duration.days()} days, `;
    }
    if (duration.hours() > 0) {
      remainingTime += `${String(duration.hours()).padStart(2, "0")}:`;
    }
    if (duration.minutes() > 0) {
      remainingTime += `${String(duration.minutes()).padStart(2, "0")}:`;
    }
    remainingTime += `${String(duration.seconds()).padStart(2, "0")}`;

    return `(${remainingTime})`;
  };

  // useEffect(() => {
  //   filteredTransactions.forEach(async (transaction: any) => {
  //     const returnDate = moment(transaction?.returnDate);
  //     const diffSeconds = returnDate.diff(moment(), "seconds");

  //     if (
  //       diffSeconds === 0 &&
  //       transaction?.isStatus &&
  //       !alertedTransactions.includes(transaction?.id)
  //     ) {
  //       const totalDaysLate = moment().diff(returnDate, "days");
  //       // Ensure totalDaysLate is at least 1 if returnDate is in the past but less than a day late
  //       const adjustedTotalDaysLate = totalDaysLate > 0 ? totalDaysLate : 1;
  //       const adjustedTotalFine = adjustedTotalDaysLate * 10000;

  //       const formData = new FormData();
  //       formData.append("idBook", transaction?.book?.id);
  //       formData.append("totalDay", adjustedTotalDaysLate.toString());
  //       formData.append("totalFine", adjustedTotalFine.toString());

  //       await dispatch(createFine({ formData, session }));

  //       setAlertedTransactions((prev: any) => [...prev, transaction?.id]);
  //     }
  //   });
  // }, [filteredTransactions, alertedTransactions]);

  return (
    <>
      <Navbar />
      <section className="w-full min-h-screen mt-20">
        <DetailTransaction
          modalDetailTransaction={modalDetailTransaction}
          setModalDetailTransaction={setModalDetailTransaction}
          closeModalDetailTransaction={closeModalDetailTransaction}
          dataTransaction={dataTransaction}
        />
        <div className="w-full px-4 md:px-10 lg:px-20 pb-10">
          <div className="mb-5 flex justify-between">
            <p className="m-0 text-center font-bold text-2xl text-gray-500">
              List Books Borrowed
            </p>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="min-w-full text-left text-sm font-light">
                        <thead className="bg-white font-medium bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 shadow shadow-gray-400">
                          <tr>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              No
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Username
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Book
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Transaction
                              <span className="text-transparent">x</span>Type
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Total<span className="text-transparent">x</span>
                              Book
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Loan<span className="text-transparent">x</span>
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Return<span className="text-transparent">x</span>
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-white font-bold text-center"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-white font-bold text-center"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <thead className="bg-white font-medium border-b-2 border-b-black">
                          <tr>
                            <th
                              scope="col"
                              className="px-2 text-gray-500 font-bold text-center"
                            ></th>
                            <th
                              scope="col"
                              className="text-gray-500 font-bold text-center flex items-center"
                            >
                              <Search
                                search={search}
                                handleSearch={handleSearchTransaction}
                              />
                            </th>
                            <th
                              scope="col"
                              className="py-4 text-gray-500 font-bold text-center"
                            ></th>
                          </tr>
                        </thead>
                        {filteredTransactions?.length > 0 ? (
                          filteredTransactions?.map(
                            (transaction: any, i: any) => {
                              return (
                                <tbody key={i}>
                                  <tr className="border-b bg-white">
                                    <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                      {i++ + 1}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                      {transaction?.user?.username}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                      {transaction?.book?.title}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                      {transaction?.transactionType}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                      {transaction?.totalBook}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                      {moment(transaction?.loanDate).format(
                                        "DD MMMM YYYY"
                                      )}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                      {moment(transaction?.returnDate).format(
                                        "DD MMMM YYYY"
                                      )}{" "}
                                      <br />
                                      <span className="font-normal text-red-500">
                                        {countdown(transaction)}
                                      </span>
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-4 font-medium text-gray-500 text-center">
                                      {transaction?.isStatus
                                        ? "Borrowed"
                                        : "Returned"}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-center">
                                      <button
                                        type="button"
                                        className="px-3 py-1 font-medium rounded-md shadow-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white hover:opacity-80"
                                        onClick={() => {
                                          setModalDetailTransaction(true);
                                          setDataTransaction(transaction);
                                        }}
                                      >
                                        Detail Transaction
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              );
                            }
                          )
                        ) : (
                          <tbody>
                            <tr className=" bg-white font-medium border-b-2 border-b-black">
                              <td
                                scope="col"
                                className="px-2 text-gray-500 text-center"
                              ></td>
                              <td
                                scope="col"
                                className="px-6 py-4 text-gray-500 text-left"
                              >
                                Books borrowed not found
                              </td>
                              <td
                                scope="col"
                                className="py-4 text-gray-500 text-center"
                              ></td>
                            </tr>
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Pagination
          totalData={transactions?.totalData}
          dataPerPage={transactions?.data?.length}
          totalPage={transactions?.totalPage}
          currentPage={transactions?.currentPage}
        />
      </section>
    </>
  );
}

export default AuthUser(ListBookBorrowed);
