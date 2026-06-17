import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function Pagination({ currentPage, totalPages, onPageChange}) {
  return (
    <div className="contacts-table-pagination">
      <div className="contacts-table-pagination-controls">
        
        {/* Previous */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page buttons */}
        {[...Array(totalPages)]?.map((_, index) => {
          const page = index + 1;
         // setPageNo(page);
          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        })}

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;