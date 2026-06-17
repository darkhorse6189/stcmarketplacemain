import { useState, useMemo } from "react";

export function usePagination({ data, rowsPerPageOptions = [5, 10, 15, 20], defaultRows = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRows);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage, rowsPerPage]);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const changePageSize = (size) => {
    setRowsPerPage(size);
    setCurrentPage(1); // reset on size change
  };

  // Generate page buttons with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= 3) {
      for (let i = 1; i <= maxButtons; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - maxButtons + 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return {
    currentPage,
    rowsPerPage,
    totalPages,
    currentData,
    pageNumbers: getPageNumbers(),
    rowsPerPageOptions,
    changePage,
    changePageSize,
  };
}
