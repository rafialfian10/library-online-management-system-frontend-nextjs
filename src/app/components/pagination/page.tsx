import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

export interface PaginationProps {
  totalData: number;
  dataPerPage: number;
  totalPage: number;
  currentPage: number;
}

const Pagination: FC<PaginationProps> = ({
  totalData,
  dataPerPage,
  totalPage,
  currentPage,
}) => {
  const router = useRouter();

  const firstPage = currentPage === 1;
  const lastPage = currentPage === totalPage;

  useEffect(() => {
    let perPage = dataPerPage;
    if (currentPage === totalPage) {
      perPage = totalData % dataPerPage || dataPerPage;
    }
    router.replace(`?page=${currentPage}&per-page=${perPage}`);
  }, [currentPage, dataPerPage, totalData, totalPage]);

  const handlePageClick = (page: number) => {
    let perPage = dataPerPage;
    if (page === totalPage) {
      perPage = totalData % dataPerPage || dataPerPage;
    }
    
    if (page >= 1 && page <= totalPage) {
      router.push(`?page=${page}&per-page=${perPage}`);
    }
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPage) {
      endPage = totalPage;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="w-full mb-10 px-0 md:px-10 lg:px-20 pb-10">
      <div className="w-full mb-2 flex max-sm:justify-center">
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">{(currentPage - 1) * 10 + 1} </span>
          to <span className="font-medium">{currentPage * 10} </span>
          of <span className="font-medium"> {totalData} </span>
          data
        </p>
      </div>
      <div className="w-full flex max-sm:justify-center">
        <nav aria-label="Page navigation example">
          <ul className="h-10 flex items-center -space-x-px text-base">
            <li>
              <button
                type="button"
                className={`h-10 ml-0 leading-tight flex items-center justify-center px-4 rounded-l-lg bg-[#808080] text-[#D2D2D2] border border-[#D2D2D2] ${
                  !firstPage ? "hover:opacity-80" : "opacity-80 cursor-text"
                }`}
                onClick={() => handlePageClick(1)}
                disabled={firstPage}
              >
                <span className="text-[#D2D2D2] font-bold">{`<<`}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`h-10 ml-0 leading-tight flex items-center justify-center px-4 bg-[#808080] text-[#D2D2D2] border border-[#D2D2D2] ${
                  !firstPage ? "hover:opacity-80" : "opacity-80 cursor-text"
                }`}
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={firstPage}
              >
                <span className="text-[#D2D2D2] font-bold">{`<`}</span>
              </button>
            </li>
            {pageNumbers.map((page) => (
              <li key={page}>
                <button
                  type="button"
                  className={`h-10 ml-0 leading-tight flex items-center justify-center px-4 text-[#D2D2D2] border border-[#D2D2D2] ${
                    currentPage == page
                      ? "bg-blue-500"
                      : "bg-[#808080] hover:opacity-80"
                  }`}
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className={`h-10 ml-0 leading-tight flex items-center justify-center px-4 bg-[#808080] text-[#D2D2D2] border border-[#D2D2D2] ${
                  !lastPage ? "hover:opacity-80" : "opacity-80 cursor-text"
                }`}
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={lastPage}
              >
                <span className="text-[#D2D2D2] font-bold">{`>`}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`h-10 ml-0 leading-tight flex items-center justify-center px-4 rounded-r-lg bg-[#808080] text-[#D2D2D2] border border-[#D2D2D2] ${
                  !lastPage ? "hover:opacity-80" : "opacity-80 cursor-text"
                }`}
                onClick={() => handlePageClick(totalPage)}
                disabled={lastPage}
              >
                <span className="text-[#D2D2D2] font-bold">{`>>`}</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
