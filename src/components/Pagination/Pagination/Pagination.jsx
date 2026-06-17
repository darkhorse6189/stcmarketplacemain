import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  rowsPerPage,
  rowsPerPageOptions,
  pageNumbers,
  changePage,
  changePageSize,
}) {
  return (
    <div className="contacts-table-pagination">
      <div className="contacts-table-pagination-controls">

        {/* Page size dropdown */}
        <select
          className="page-size-dropdown"
          value={rowsPerPage}
          onChange={(e) => changePageSize(Number(e.target.value))}
        >
          {rowsPerPageOptions?.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>

        {/* Previous Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="contacts-table-pagination-button"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Number Buttons */}
        {pageNumbers?.map((page, idx) => (
          <Button
            key={idx}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => typeof page === "number" && changePage(page)}
            disabled={page === "..."}
            className={cn(
              "contacts-table-pagination-button",
              page === "..." && "contacts-table-pagination-ellipsis"
            )}
          >
            {page}
          </Button>
        ))}

        {/* Next Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="contacts-table-pagination-button"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
